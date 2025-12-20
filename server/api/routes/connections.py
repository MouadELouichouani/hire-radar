from flask import Blueprint
from controllers.connections import (
    send_request,
    get_requests,
    accept_request,
    reject_request,
)

connections = Blueprint("connections", __name__)

connections.add_url_rule(
    "/request",
    "send_request",
    send_request,
    methods=["POST"],
)

connections.add_url_rule(
    "/requests",
    "get_requests",
    get_requests,
    methods=["GET"],
)

connections.add_url_rule(
    "/requests/<int:request_id>/accept",
    "accept_request",
    accept_request,
    methods=["PUT"],
)

connections.add_url_rule(
    "/requests/<int:request_id>/reject",
    "reject_request",
    reject_request,
    methods=["PUT"],
)
