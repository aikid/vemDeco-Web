interface DataNotification{
    name: string;
    email: string
}

export interface Notifications {
    _id: string;
    ownerId: string;
    userId: string;
    notificationType: "invite-subscription" | "other";
    active: string;
    data: DataNotification;
    createdAt: string;
    updatedAt: string;
}