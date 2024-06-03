example curls:

URL: http://ec2-3-133-234-81.us-east-2.compute.amazonaws.com/


 curl -X POST http://localhost:80/openai -H "Content-Type: application/json" -d '{"model": "gpt-4", "prompt": "write me an essay about how to develop Mongolia"}'  -H "Authorization: Bearer your_token" 

curl localhost:80/models -H "Authorization: Bearer token" 



curl -X POST http://localhost/users \
-H "Content-Type: application/json" \
-d '{
    "id": "unique_user_id",
    "firstname": "John",
    "lastname": "Doe",
    "dob": "1990-01-01",
    "running_balance": 100
}'



curl -X GET http://localhost/users


curl -X GET http://localhost/users/nfClq5PitgsxY5ho7wNq


curl -X PUT "http://localhost/users/nfClq5PitgsxY5ho7wNq" \
-H "Content-Type: application/json" \
-d '{
    "firstname": "Jane",
    "lastname": "Smith",
    "dob": "1992-02-02"
}'


curl -X PUT http://localhost/users/update-balance/nfClq5PitgsxY5ho7wNq \
-H "Content-Type: application/json" \
-d '{
    "balanceChange": 50
}'


curl -X POST http://localhost/api/service/openai \
-H "Content-Type: application/json" \
-H "Authorization: Bearer VZ6333jTvi6JvDzv1eFogPPT3BlbkFwordQWYtJbk7K269asdQPO" \
-d '{"model": "gpt-4", "prompt": "say hi", "userId": "nfClq5PitgsxY5ho7wNq"}'


 curl -X POST http://localhost:80/api/service/gemini \
-H "Content-Type: application/json" \
-H "Authorization: Bearer VZ6333jTvi6JvDzv1eFogPPT3BlbkFwordQWYtJbk7K269asdQPO" \
-d '{"model": "gemini-1.0-pro-002", "prompt": "say hi", "userId": "nfClq5PitgsxY5ho7wNq"}'


curl -X POST http://localhost/api/service/claude \
-H "Content-Type: application/json" \
-H "Authorization: Bearer VZ6333jTvi6JvDzv1eFogPPT3BlbkFwordQWYtJbk7K269asdQPO" \
-d '{
    "userId": "nfClq5PitgsxY5ho7wNq",
    "prompt": "Whatsup?",
    "model": "claude-3-opus-20240229"
}'



curl -X POST  -H "Content-Type: application/json" -d '{"amount": "99"}'  -H "Authorization: Bearer VZ6333jTvi6JvDzv1eFogPPT3BlbkFwordQWYtJbk7K269asdQPO" localhost:80/processQpayPayment


curl -X POST http://ec2-3-133-234-81.us-east-2.compute.amazonaws.com/checkInvoice \
-H "Content-Type: application/json" \
-d '{
    "invoiceId": "784c7c29-8026-42ac-909b-d5fe79919434",
    "userId": "nfClq5PitgsxY5ho7wNq"
}'
