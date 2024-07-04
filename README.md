# Receipt Processor Service

This project is a web service that processes receipts and calculates points based on specified rules. The service provides two main endpoints: one for processing receipts and another for retrieving the points awarded to a receipt.


## Using Docker

1. Start Docker Application
2. Build the Docker image:  docker build -t receipt-processor-service .
3. Run the Docker container: docker run -p 3000:3000 receipt-processor-service

## API Endpoints

1. Process Receipts
        URL: /receipts/process
        Method: POST
        Payload: Receipt JSON
        Response: JSON containing an id for the receipt

2. Get Points
        URL: /receipts/{id}/points
        Method: GET
        Response: JSON object containing the number of points awarded


## Testing with Postman

1. Process Receipts Endpoint
      Open Postman.
      Create a new POST request.
      Set the URL to http://localhost:3000/receipts/process.
      Go to the Body tab, select Raw, and set the type to JSON.
      Enter the receipt JSON in the body section.
      Click Send.
      Get Points Endpoint
      Copy the id from the response of the Process Receipts request.
      Create a new GET request.
      Set the URL to http://localhost:3000/receipts/{id}/points, replacing {id} with the actual ID.
      Click Send.
    
2. Get Points Endpoint
      Copy the id from the response of the Process Receipts request.
      Create a new GET request.
      Set the URL to http://localhost:3000/receipts/{id}/points, replacing {id} with the actual ID.
      Click Send.