# Signal Project

## Endpoints

### Add Signal Light Data

- **Route:** `/add-signal-light`
- **Method:** POST
- **Description:** Adds new signal light data to the system.
- **Request Body:**
  - `location` (Object): The location coordinates and angle of the traffic signal.
    - `latitude` (Number): The latitude of the signal.
    - `longitude` (Number): The longitude of the signal.
    - `angle` (Number): The angle of the signal.
  - `address` (Object): The address details of the signal.
    - `circleName` (String): The name of the circle.
    - `road` (String): The road where the signal is located.
    - `area` (String): The area where the signal is located.
    - `city` (String): The city where the signal is located.
    - `pincode` (Number): The pincode of the signal location.
  - `junctionType` (String): The type of junction the signal is located at.
  - `aspects` (Object): The aspects of the signal, including the current color and duration.
    - `red` (Number): The duration for the red light.
    - `yellow` (Number): The duration for the yellow light.
    - `green` (Number): The duration for the green light.
    - `currentColor` (String): The current color of the traffic signal.
    - `durationInSeconds` (Number): The total duration of the signal cycle in seconds.
  - `signalStatus` (String): The status of the signal, either 'working' or 'notWorking'.
  - `signalId` (String): The unique identifier for the signal.
  - `circleId` (String): The unique identifier for the circle to which the signal belongs.

### Update Signal

- **Route:** `/update-signal/:Id`
- **Method:** PUT
- **Description:** Updates information about a specific signal.
- **Request Parameters:**
  - `Id` (String): The ID of the signal to be updated.
- **Request Body:**
  - Fields to be updated.

### Get All Signals

- **Route:** `/get-signal`
- **Method:** GET
- **Description:** Retrieves information about all signals.

### Get Signals by Coordinates

- **Route:** `/get-signal/bycoordinates`
- **Method:** GET
- **Description:** Finds signals based on geographical coordinates.
- **Request Body:**
  - `lat` (Number): Latitude.
  - `lon` (Number): Longitude.
  - `maxDistance` (Number): Maximum distance in kilometers.

### Get Signals by Circle ID

- **Route:** `/get-signal/bycircle`
- **Method:** GET
- **Description:** Retrieves signals based on the circle ID.
- **Request Body:**
  - `circleId` (String): The ID of the circle.

### Live Update Signal

- **Route:** `/live-update/:Id`
- **Method:** PUT
- **Description:** Updates the duration and color of a specific signal in real-time.
- **Request Parameters:**
  - `Id` (String): The ID of the signal.
- **Request Body:**
  - `durationInSeconds` (Number): The updated duration of the signal cycle in seconds.
  - `currentColor` (String): The updated color of the traffic signal.

### Add Circle

- **Route:** `/add-circle`
- **Method:** POST
- **Description:** Adds a new circle to the system.
- **Request Body:**
  - `circleId` (String): The unique identifier for the circle.
  - `numberOfSignals` (Number): The number of signals in the circle (default: 0).
  - `coordinates` (Object): The coordinates (latitude and longitude) of the circle.
    - `latitude` (Number): The latitude of the circle.
    - `longitude` (Number): The longitude of the circle.
  - `address` (Object): The address details of the circle.
    - `circleName` (String): The name of the circle.
    - `road` (String): The road where the circle is located.
    - `area` (String): The area where the circle is located.
    - `city` (String): The city where the circle is located.
    - `pincode` (Number): The pincode of the circle location.
  - `signalIds` (Array): An array of signal IDs associated with the circle.
  - `createdAt` (Date): The date and time when the circle was created (default: current date and time).
  - `updatedAt` (Date): The date and time when the circle was last updated (default: null).

### Get Circle by ID

- **Route:** `/get-circle/byId`
- **Method:** GET
- **Description:** Retrieves information about a specific circle.
- **Request Body:**
  - `circleId` (String): The ID of the circle.

### Get Signal by ID

- **Route:** `/get-signal/byId`
- **Method:** GET
- **Description:** Retrieves information about a specific signal.
- **Request Body:**
  - `signalId` (String): The ID of the circle.

### Get All Circles

- **Route:** `/get-circle`
- **Method:** GET
- **Description:** Retrieves information about all circles.
