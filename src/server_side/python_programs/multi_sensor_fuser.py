import sys
import json
import math
from micropython_fusion.fusion import Fusion

DEGREES_PER_RADIAN = 360 / (2*math.pi)

timediff_func = lambda start, end : 33.0/1000

lines = sys.stdin.readlines()
cl_params = json.loads(sys.argv[1])
print("# Python params: {0}".format(cl_params))
time_column = int(cl_params['time_column'])
sensor_columns = cl_params['sensor_columns']
sensors = []
for sensor in sensor_columns:
    sensors.append({
        'start_column': int(sensor['start_column']),
        'accel_tuples': [],
        'gyro_tuples': [],
        'mag_tuples': [],
        'fuser': Fusion(timediff_func),
        'quaternions': []
    })
time_stamps = []

for line in lines:
    datapts = line.split(' ')
    if datapts[0] == '#' or datapts[0] == '':
        continue
    time_stamps.append(float(datapts[time_column]) / 1000.0)
    for sensor in sensors:
        start_column = sensor['start_column']
        accel = (float(datapts[start_column]) / 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+1])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+2])/ 1000 * DEGREES_PER_RADIAN)
        gyro = (float(datapts[start_column+3])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+4])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+5])/ 1000 * DEGREES_PER_RADIAN)
        mag = (float(datapts[start_column+6])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+7])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+8])/ 1000 * DEGREES_PER_RADIAN)
        sensor['accel_tuples'].append(accel)
        sensor['gyro_tuples'].append(gyro)
        sensor['mag_tuples'].append(mag)

print("# Number of data points: {0}".format(len(time_stamps)))
for sensor in sensors:
    count = 0
    while count < len(sensor['accel_tuples']):
        # fuse.update(imu.accel.xyz, imu.gyro.xyz, imu.mag.xyz) # Note blocking mag read
        sensor['fuser'].update(sensor['accel_tuples'][count], sensor['gyro_tuples'][count], sensor['mag_tuples'][count], time_stamps[count]) # Note blocking mag read <- What does this mean?
        sensor['quaternions'].append(sensor['fuser'].q)
        count += 1

print("# Number of quaternions: {0}".format(count))
print("{0}".format(count))
for i in range(count):
    for j in range(len(sensors)):
        print("{:.3f} {:.3f} {:.3f} {:.3f}".format(sensors[j]['quaternions'][i][0], sensors[j]['quaternions'][i][1], sensors[j]['quaternions'][i][2], sensors[j]['quaternions'][i][3]), end=' ')  # Quats are in wxyz format
    print()

# sys.stdout.close()