
'use server-only';

import { adminDb, adminMessaging } from './firebase-admin';
import type { Customer } from './types';
import { MulticastMessage } from 'firebase-admin/messaging';

// This function uses the ADMIN SDK and is for SERVER-SIDE use only.

export const sendNotificationToAll = async (payload: { title: string, body: string, [key: string]: string }) => {
    try {
        const customersSnapshot = await adminDb.collection('customers').get();
        const tokens: string[] = [];

        customersSnapshot.forEach(doc => {
            const customer = doc.data() as Customer;
            if (customer.fcmTokens && Array.isArray(customer.fcmTokens)) {
                tokens.push(...customer.fcmTokens);
            }
        });

        if (tokens.length === 0) {
            console.log("No FCM tokens found to send notifications to.");
            return { successCount: 0, failureCount: 0 };
        }

        const uniqueTokens = [...new Set(tokens)];

        const message: MulticastMessage = {
            tokens: uniqueTokens,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload,
        };
        
        const response = await adminMessaging.sendMulticast(message);

        console.log(`Successfully sent message to ${response.successCount} devices.`);
        if (response.failureCount > 0) {
            console.error(`Failed to send message to ${response.failureCount} devices.`);
            response.responses.forEach((result, index) => {
                if (!result.success) {
                    console.error(`Failure for token ${uniqueTokens[index]}:`, result.error);
                }
            });
        }
        
        return {
            successCount: response.successCount,
            failureCount: response.failureCount,
        };

    } catch (error) {
        console.error("Error sending push notification to all users:", error);
        throw error;
    }
}
