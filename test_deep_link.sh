#!/bin/bash

# Script để test deep link trực tiếp
echo "🧪 Testing deep link trực tiếp..."

# Test với order code từ log backend
ORDER_CODE="ORD-913127-JF27"
DEEP_LINK_URL="f7shop://payment-result?status=success&orderId=${ORDER_CODE}&amount=180000&transactionId=15139695"

echo "🔗 Testing deep link: $DEEP_LINK_URL"

# Test trên Android emulator
adb shell am start -W -a android.intent.action.VIEW -d "$DEEP_LINK_URL" com.md12_reactapp_qathethao

echo "✅ Deep link test completed!"
echo "📱 Check your app for navigation to CheckVnPayMent screen"

