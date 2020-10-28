from django.shortcuts import render
from .serialziers import CandidateSerializer, ElectionSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Election
# Create your views here.


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_election(request):
    data = request.data.copy()
    data["admin"] = request.user.id
    electionSerializer = ElectionSerializer(
        data=data)
    if electionSerializer.is_valid(raise_exception=True):
        election = electionSerializer.save()
    return Response(electionSerializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_election(request):
    qs = Election.objects.filter(id=request.data.get("id"),
                                 admin_id=request.user.id)
    if not qs.exists():
        Response({"error": "election doesnt exists"}, status=400)

    electionSerializer = ElectionSerializer(
        qs[0], data=request.data, partial=True)
    if electionSerializer.is_valid(raise_exception=True):
        election = electionSerializer.save()
    return Response(electionSerializer.data)


@api_view(['GET'])
def get_election(request, id):
    qs = Election.objects.filter(id=id)
    if not qs.exists():
        return Response({"error": "election doesnt exist"}, status=404)
    electionSerializer = ElectionSerializer(qs[0])
    return Response(electionSerializer.data)
