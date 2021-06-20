# fusiontest.py Simple test program for sensor fusion on Pyboard
# Author Peter Hinch
# Released under the MIT License (MIT)
# Copyright (c) 2017 Peter Hinch
# V0.8 14th May 2017 Option for external switch for cal test. Make platform independent.
# V0.7 25th June 2015 Adapted for new MPU9x50 interface

# import utime as time
from fusion import Fusion
import math

timediff_func = lambda start, end : 33.0/1000

fuse = Fusion(timediff_func)

# Choose test to run
Timing = False

START_COL = 76
DEGREES_PER_RADIAN = 360 / (2*math.pi)

accel_tuples = []
gyro_tuples = []
mag_tuples = []
time_stamps = []

# Starting at column 76 is LUA acc, gyro, mag
with open('../data-samples/S1-Drill.dat') as f:
    datalines = f.readlines()
    for line in datalines:
        datapts = line.split(' ')
        if datapts[0] == '#' or datapts[0] == '':
            continue
        accel = (float(datapts[START_COL]) / 1000 * DEGREES_PER_RADIAN, float(datapts[START_COL+1])/ 1000 * DEGREES_PER_RADIAN, float(datapts[START_COL+2])/ 1000 * DEGREES_PER_RADIAN)
        gyro = (float(datapts[START_COL+3])/ 1000 * DEGREES_PER_RADIAN, float(datapts[START_COL+4])/ 1000 * DEGREES_PER_RADIAN, float(datapts[START_COL+5])/ 1000 * DEGREES_PER_RADIAN)
        mag = (float(datapts[START_COL+6])/ 1000 * DEGREES_PER_RADIAN, float(datapts[START_COL+7])/ 1000 * DEGREES_PER_RADIAN, float(datapts[START_COL+8])/ 1000 * DEGREES_PER_RADIAN)
        timeval = float(datapts[0]) / 1000.0
        accel_tuples.append(accel)
        gyro_tuples.append(gyro)
        mag_tuples.append(mag)
        time_stamps.append(timeval)
print("Accel tuples length: ", len(accel_tuples))


# if Timing:
#     mag = imu.mag.xyz # Don't include blocking read in time
#     accel = imu.accel.xyz # or i2c
#     gyro = imu.gyro.xyz
#     start = time.ticks_us()  # Measure computation time only
#     fuse.update(accel, gyro, mag) # 1.97mS on Pyboard
#     t = time.ticks_diff(time.ticks_us(), start)
#     print("Update time (uS):", t)

count = 0
quat_list = []
while count < len(accel_tuples):
    # fuse.update(imu.accel.xyz, imu.gyro.xyz, imu.mag.xyz) # Note blocking mag read
    fuse.update(accel_tuples[count], gyro_tuples[count], mag_tuples[count], time_stamps[count]) # Note blocking mag read
    quat_list.append(fuse.q)
    count += 1

count = 0
with open("fusion_output_S1_Drill.dat", "w") as f:
    while count < len(quat_list):
        f.write("{:.3f} {:.3f} {:.3f} {:.3f}\n".format(quat_list[count][0], quat_list[count][1], quat_list[count][2], quat_list[count][3]))
        if count % 50 == 0:
            # print("Heading, Pitch, Roll: {:7.3f} {:7.3f} {:7.3f}".format(fuse.heading, fuse.pitch, fuse.roll))
            print("Quaternion orientation: w={:7.3f} x={:7.3f} y={:7.3f} z={:7.3f}".format(quat_list[count][0], quat_list[count][1], quat_list[count][2], quat_list[count][3]))
        count += 1
