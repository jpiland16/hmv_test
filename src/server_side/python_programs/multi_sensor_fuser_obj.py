import sys
import json
import math
from micropython_fusion.fusion import Fusion
from datatype_handlers.AccGyroMagnetHandler import AGMHandler
from datatype_handlers.QuaternionHandler import QuaternionHandler

"""Uses a class-based system to deal differently with incoming data depending on the reported datatype."""

def get_handler(data_type):
    if data_type == 'Quaternion':
        return QuaternionHandler()
    if data_type == 'Accel+Gyro+Magnet':
        return AGMHandler()
    return None

lines = sys.stdin.readlines()

cl_params = json.loads(sys.argv[1])
# print("# Python params: {0}".format(cl_params))
time_column = int(cl_params['time_column'])
sensor_columns = cl_params['sensor_columns']

# Each sensor gets its own handler, which then produces the final quaternions
quat_list = []
if len(sensor_columns) < 1:
    # sys.stderr.write("No sensor info was received!")
    sys.exit("No sensor info was received.")
for sensor_info in sensor_columns:
    sensor = get_handler(sensor_info['data_type'])
    if (sensor == None):
        # sys.stderr.write("Invalid data type given for a sensor!")
        # exit()
        sys.exit("Invalid data type given for a sensor.")
    quat_list.append(sensor.get_quaternions(lines, int(sensor_info['start_column']), time_column))

print("# Number of quaternions: {0}".format(len(quat_list)))
print("{0}".format(len(quat_list[0])))
for i in range(len(quat_list[0])):
    for j in range(len(quat_list)):
        print("{:.3f} {:.3f} {:.3f} {:.3f}".format(quat_list[j][i][0], quat_list[j][i][1], quat_list[j][i][2], quat_list[j][i][3]), end=' ')  # Quats are in wxyz format
    print()