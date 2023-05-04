from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response

from ticket.serializers import TicketSerializer, CheckTiketSerializer
from ticket.models import Ticket, UserTicket

from user.serializers import UserSerializer

from utils.authentication import LoginRequiredAuthentication
from utils.custom_exception import CustomException


class TicketViewSet(ModelViewSet):
    """
    Ticket API 
    """
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer


class CheckTicketView(APIView):

    authentication_classes = [LoginRequiredAuthentication]
    
    def post(self, request):
        serializer = CheckTiketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not serializer.is_this_user_ticket():
            raise CustomException(message='Билет бұл пайдаланушыға тиесілі емес')

        user_ticket = UserTicket.objects.get(buyer=request.data.get('buyer'), ticket=request.data.get('ticket'))

        ticket = TicketSerializer(instance=user_ticket.ticket)
        ticket.context['request'] = request
        ticket = ticket.data

        # 添加购票者信息
        ticket['buyer'] = UserSerializer(instance=user_ticket.buyer).data
        ticket['purchase_time'] = user_ticket.purchase_time

        return Response(data=ticket)
