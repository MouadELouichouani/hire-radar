from flask import Blueprint
from controllers.notifications import get_notifications, mark_notification_read

notifications = Blueprint("notifications", __name__)

notifications.add_url_rule(
    "/",
    "get_notifications",
    get_notifications,
    methods=["GET"],
)

notifications.add_url_rule(
    "/<int:notification_id>/read",
    "mark_notification_read",
    mark_notification_read,
    methods=["PUT"],
)
