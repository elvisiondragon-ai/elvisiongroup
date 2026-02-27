#!/bin/bash
TOKEN="EAARivNfjDnEBQ4T5clZCkxQFwLWwZAvEKt2OhVHcKpcORLSZAAZACjfyrMQhN75yiyyhpNlmcHFCo14ZBKHjHnWOLDlfXQSMeLltPa2aZCqJE0LKzVkDoIH4jYtZCGAxN5a8BT7eL55cI7NCoUyZAIxXa4ItUDc1vrc6kDCdonZAW5YTWQYdnilWXppwEHvThxr19fwINlCYTUfltPggeGuopZBb6ZAaxUhkaq5tWENq5OVOpIgjpsqZCTIoxyqvJ9l3gQRJ9P9uw3UVpoWB8x83ZBQf5gwZDZD"
PAGE="518894044637696"
USER="26047262674890797"
IG="17841400529912607"

echo "1. pages_read_user_content"
curl -s "https://graph.facebook.com/v21.0/$PAGE/visitor_posts?access_token=$TOKEN" | grep -o "data"

echo "2. pages_messaging"
curl -s "https://graph.facebook.com/v21.0/$PAGE/conversations?access_token=$TOKEN" | grep -o "data"

echo "3. pages_manage_posts"
curl -s -X POST "https://graph.facebook.com/v21.0/$PAGE/photos" -d "access_token=$TOKEN" -d "url=https://via.placeholder.com/150" -d "published=false" | grep -o "id"

echo "4. pages_manage_engagement"
POST_ID=$(curl -s "https://graph.facebook.com/v21.0/$PAGE/feed?limit=1&access_token=$TOKEN" | grep -o '"id":"[^"]*' | head -1 | cut -d '"' -f 4)
if [ ! -z "$POST_ID" ]; then
  curl -s -X POST "https://graph.facebook.com/v21.0/$POST_ID/likes" -d "access_token=$TOKEN" | grep -o "success"
fi

echo "5. instagram_content_publish"
curl -s -X POST "https://graph.facebook.com/v21.0/$IG/media" -d "access_token=$TOKEN" -d "image_url=https://via.placeholder.com/150" -d "caption=Test" | grep -o "id"

echo "6. instagram_manage_comments"
IG_POST=$(curl -s "https://graph.facebook.com/v21.0/$IG/media?access_token=$TOKEN" | grep -o '"id":"[^"]*' | head -1 | cut -d '"' -f 4)
if [ ! -z "$IG_POST" ]; then
  curl -s -X POST "https://graph.facebook.com/v21.0/$IG_POST/comments" -d "access_token=$TOKEN" -d "message=Halo" | grep -o "id"
fi

echo "Done"
