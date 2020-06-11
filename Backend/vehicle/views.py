from django.shortcuts import render

from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions

from .models import Vehicle, ImageSpace
from .serializers import VehicleSerializer
from tools.viewsets import ActionAPI, validate_params


class VehicleBase(ActionAPI):
    # TODO: Place this back in when login is added
    # permission_classes = [permissions.IsAuthenticated, ] 
    @csrf_exempt
    @validate_params(['license_plate'])
    def get_vehicle(self, request, params=None, *args, **kwargs):
        """
        Simply a way of getting all the information on a specified vehicle
        """
        try:
            vehicle = Vehicle.objects.get(license_plate=params['license_plate'])
        except Vehicle.DoesNotExist:
            return {
                "success": False,
                "message": "Vehicle with that license plate does not exist"
            }

        serializer = VehicleSerializer(vehicle)
        return serializer.data
        
    @csrf_exempt
    @validate_params(['license_plate', 'color', 'make', 'model'])
    def add_vehicle_basic(self, request, params=None, *args, **kwargs):
        """
        Used to add vehicles
        """

        # TODO: Implement SAPS flag checking

        # TODO: Implement sending warnings on duplicates

        vehicle = Vehicle.objects.filter(license_plate=params['license_plate'])

        if vehicle.count() > 0:
            vehicle = vehicle[0]

            if params['make'] != vehicle.make or vehicle.model != params['model'] or vehicle.color != params['color']:
                # This license plate is a duplicate in this case
                vehicle.license_plate_duplicate = True
                vehicle.save()
                data = {
                    "license_plate": params["license_plate"],
                    "make": params["make"],
                    "model": params["model"],
                    "color": params["color"],
                    "saps_flagged": False,
                    "license_plate_duplicate": True
                }

                serializer = VehicleSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return serializer.data
                return serializer.errors

            # This vehicle is not a duplicate but already exists within the system
            # TODO: Add tracking stuff
        
        # This vehicle is not within our system yet, add it

        data = {
            "license_plate": params["license_plate"],
            "make": params["make"],
            "model": params["model"],
            "color": params["color"],
            "saps_flagged": False, #TODO: Add this checking stuff
            "license_plate_duplicate": False
        }

        serializer = VehicleSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        data = {
            "success": False,
            "payload": serializer.errors
        }
        return data

    @csrf_exempt
    def search_or(self, request, params=None, *args, **kwargs):
        """ 
        Used to search for vehicles by various paramaters
        """

        queryset = Vehicle.objects.none()

        filters = params.get('filters', {})

        license_plate = filters.get('license_plate', None)
        make = filters.get('make', None)
        model = filters.get('model', None)
        color = filters.get('color', None)
        saps_flagged = filters.get('saps_flagged', None)
        license_plate_duplicate = filters.get('license_plate_duplicate', None)

        if license_plate:
            queryset |= Vehicle.objects.filter(license_plate=license_plate)
        if make:
            queryset |= Vehicle.objects.filter(make=make)
        if model:
            queryset |= Vehicle.objects.filter(model=model)
        if color:
            queryset |= Vehicle.objects.filter(color=color)
        if saps_flagged:
            queryset |= Vehicle.objects.filter(saps_flagged=saps_flagged)
        if license_plate_duplicate:
            queryset |= Vehicle.objects.filter(license_plate_duplicate=license_plate_duplicate)

        if queryset.count() == 0:
            return {
                "success": False,
                "message": "No data matching query"
            }

        serializer = VehicleSerializer(queryset, many=True)

        return serializer.data

    @csrf_exempt
    def file_recognize(self, request, params=None, *args, **kwargs):
        """
        Used to upload a file and run it through OpenALPR and save an instance of a vehicle to that image
        """

        from lpr.lpr import check_image

        temp = ImageSpace(image=params['file'])
        temp.save()
        path = temp.image.path

        result = check_image(path)

        result = result.get('results', [])
        result = result[0]
        plate = result.get('plate', None)

        if plate is not None:
            # TODO: Implement all the 'tbi' factors as well as damage
            data = {
                'license_plate': plate,
                'color': 'tbi',
                'make' : 'tbi',
                'model': 'tbi',
                'saps_flagged': False,
                'license_plate_duplicate': False,
            }

            serializer = VehicleSerializer(data=data)
            if serializer.is_valid():
                vehicle = serializer.save()
                temp.vehicle = vehicle
                temp.save()
                return serializer.data
            return {
                "success": False,
                "payload": serializer.errors
            }

        return {
            "success": False,
            "reason": "Something went wrong with OpenALPR"
        }