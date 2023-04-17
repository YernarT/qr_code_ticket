from django.contrib import admin
from ticket.models import Ticket, UserTicket

# Register your models here.

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    pass

@admin.register(UserTicket)
class UserTicketAdmin(admin.ModelAdmin):
    pass