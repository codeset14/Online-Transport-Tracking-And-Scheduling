class User:
    def __init__(self, id, name, email, password):
        self.id = id
        self.name = name
        self.email = email
        self.password = password

class Driver:
    def __init__(self, id, name, email, password):
        self.id = id
        self.name = name
        self.email = email
        self.password = password

class Admin:
    def __init__(self, id, name, email, password):
        self.id = id
        self.name = name
        self.email = email
        self.password = password

class Bus:
    def __init__(self, id, name, source, destination, routeId, fare):
        self.id = id
        self.name = name
        self.source = source
        self.destination = destination
        self.routeId = routeId
        self.fare = fare

class Booking:
    def __init__(self, user_id, bus_id, route_id, seat, date, fare):
        self.user_id = user_id
        self.bus_id = bus_id
        self.route_id = route_id
        self.seat = seat
        self.date = date
        self.fare = fare
