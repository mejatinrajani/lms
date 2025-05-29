
from rest_framework import serializers
from .models import Message, MessageRead, ParentTeacherMeeting, ChatRoom, ChatMessage
from core.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_details = UserSerializer(source='sender', read_only=True)
    recipients_details = UserSerializer(source='recipients', many=True, read_only=True)
    read_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'recipients', 'subject', 'content', 'message_type',
            'priority', 'class_recipients', 'attachment', 'is_urgent',
            'scheduled_send', 'sent_at', 'sender_details', 'recipients_details',
            'read_count'
        ]
        read_only_fields = ['sender', 'sent_at']
    
    def get_read_count(self, obj):
        return obj.read_status.count()

class MessageReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageRead
        fields = ['id', 'message', 'user', 'read_at']

class ParentTeacherMeetingSerializer(serializers.ModelSerializer):
    teacher_details = UserSerializer(source='teacher', read_only=True)
    parent_details = UserSerializer(source='parent', read_only=True)
    student_details = UserSerializer(source='student', read_only=True)
    
    class Meta:
        model = ParentTeacherMeeting
        fields = [
            'id', 'teacher', 'parent', 'student', 'subject', 'description',
            'scheduled_date', 'duration_minutes', 'meeting_link', 'meeting_room',
            'status', 'notes', 'created_at', 'updated_at', 'teacher_details',
            'parent_details', 'student_details'
        ]

class ChatRoomSerializer(serializers.ModelSerializer):
    members_details = UserSerializer(source='members', many=True, read_only=True)
    created_by_details = UserSerializer(source='created_by', read_only=True)
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'room_type', 'members', 'class_related',
            'subject_related', 'created_by', 'is_active', 'created_at',
            'members_details', 'created_by_details', 'last_message'
        ]
        read_only_fields = ['created_by']
    
    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return ChatMessageSerializer(last_message).data
        return None

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_details = UserSerializer(source='sender', read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'room', 'sender', 'content', 'attachment', 'reply_to',
            'is_edited', 'edited_at', 'sent_at', 'sender_details'
        ]
        read_only_fields = ['sender', 'sent_at']
