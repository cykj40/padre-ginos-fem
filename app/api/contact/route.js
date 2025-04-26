import { NextResponse } from 'next/server';

// In a real app, this would send an email or save to database
// For demo purposes, we'll just log the message
const messages = [];

export async function POST(request) {
    try {
        const contactData = await request.json();

        // Validate contact data (simplified version)
        if (!contactData.name || !contactData.email || !contactData.message) {
            return NextResponse.json(
                { error: 'Please fill out all required fields' },
                { status: 400 }
            );
        }

        // Email validation (basic)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactData.email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // In a real app, send email using a service like SendGrid, Mailgun, etc.
        console.log('Contact form submission:', contactData);

        // Add to messages array with timestamp
        const newMessage = {
            ...contactData,
            id: 'msg-' + Date.now(),
            date: new Date().toISOString()
        };

        messages.push(newMessage);

        // Keep only last 20 messages for demo purposes
        if (messages.length > 20) {
            messages.shift();
        }

        return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
} 