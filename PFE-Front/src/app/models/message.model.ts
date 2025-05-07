export interface Sender {
    email: string;
    profileImage: string;
    name: string;
    phoneNumber: string;
    lastname: string;
  }
  
  export interface PropertyInfo {
    id: number;
    generalinfo: {
      title: string;
    };
  }
  
  export interface Message {
    id: number;
    subject: string;
    message: string;
    createdAt: string;
    sender: Sender;
    Property: PropertyInfo;
    isRead: boolean;
    replies?: MessageReply[];
  }
  
  export interface MessageReply {
    id: number;
    message: string;
    createdAt: string;
    sender: string;
  }