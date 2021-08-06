# Multi-sensor Fuser [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/server_side/python_programs/multi_sensor_fuser_obj.py)
The server-side code uses this program to split up the incoming data and transform it into orientation quaternions using the appropriate tool for each sensor.

The server hands it arguments in two ways. For column indices, such as the index of an individual sensor's data, it uses stringified JSON. For the actual data from the submitted file, the handler uses `stdin`.
The script then outputs its values via `stdout` by printing them, so **the prints in this script are important for its functionality**.

The `get_handler` function returns the appropriate `DataTypeHandler` based on the type of data being parsed. This function is the only source of the mapping between labels (e.g. 'Quaternion') and handlers (e.g. `QuaternionHanlder`).
It would be just as good to have a Python map, and even better to have a data file with this mapping. There is not a standard for which python files are in charge of checking that the incoming data is valid. Ideally,
this would be done by both the multi-sensor fuser and by the sensor-specific data type handlers. At present, the calling function is in charge of catching any error that gets thrown and then aborting the process.

### Data Type Handler [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/server_side/python_programs/datatype_handlers/DatatypeHandler.py)
This interface is how all data is processed into orientation quaternions. If you want a new datatype (Example: Delta quaternions), you need to make a new Python class overriding the `get_quaternions` method.
You then need to add the new handler's instantiation to the Multi-sensor Fuser.
Here is a list of the existing data type handlers with some notes:
- `QuaternionHandler`
  - This does no processing on the incoming data.
- `AGMHandler`
  - This expects the incoming data to be in (accelerometer, gyroscope, magnetometer) order, and will produce nonsensical data if the order is incorrect. It uses the (micropython-fusion)[https://github.com/micropython-IMU/micropython-fusion] by Peter Hinch, so removing the `micropython-fusion/` directory will break this handler.
- `AGHandler`
  - Same as AGMHandler but without the magnet data.
- EulerAngleHandler
  - This expects the data in (roll, pitch, yaw) order.
