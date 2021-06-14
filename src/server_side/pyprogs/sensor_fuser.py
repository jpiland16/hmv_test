import sys
import json
import math
from micropython_fusion.fusion import Fusion

DEGREES_PER_RADIAN = 360 / (2*math.pi)

timediff_func = lambda start, end : 33.0/1000
fuse = Fusion(timediff_func)

lines = sys.stdin.readlines()
cl_params = json.loads(sys.argv[1])
print("# Python params: {0}".format(cl_params))
start_column = int(cl_params['start_column'])
time_column = int(cl_params['time_column'])

accel_tuples = []
gyro_tuples = []
mag_tuples = []
time_stamps = []

for line in lines:
    datapts = line.split(' ')
    if datapts[0] == '#' or datapts[0] == '':
        continue
    accel = (float(datapts[start_column]) / 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+1])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+2])/ 1000 * DEGREES_PER_RADIAN)
    gyro = (float(datapts[start_column+3])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+4])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+5])/ 1000 * DEGREES_PER_RADIAN)
    mag = (float(datapts[start_column+6])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+7])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+8])/ 1000 * DEGREES_PER_RADIAN)
    timeval = float(datapts[time_column]) / 1000.0
    accel_tuples.append(accel)
    gyro_tuples.append(gyro)
    mag_tuples.append(mag)
    time_stamps.append(timeval)
    
count = 0
quat_list = []
print("# Number of data points: {0}".format(len(accel_tuples)))
while count < len(accel_tuples):
    # fuse.update(imu.accel.xyz, imu.gyro.xyz, imu.mag.xyz) # Note blocking mag read
    fuse.update(accel_tuples[count], gyro_tuples[count], mag_tuples[count], time_stamps[count]) # Note blocking mag read <- What does this mean?
    quat_list.append(fuse.q)
    count += 1

count = 0
print("# Number of quaternions: {0}")
print("{0}".format(len(quat_list)))
while count < len(quat_list):
    print("{:.3f} {:.3f} {:.3f} {:.3f}\n".format(quat_list[count][0], quat_list[count][1], quat_list[count][2], quat_list[count][3]))  # Quats are in wxyz format
    if count % 50 == 0:
        pass
    count += 1

# sys.stdout.close()