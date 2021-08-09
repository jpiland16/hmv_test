import math
from .DatatypeHandler import DatatypeHandler
from micropython_fusion.fusion import Fusion

DEGREES_PER_RADIAN = 360 / (2*math.pi)

class AGHandler(DatatypeHandler):
    def get_quaternions(self, data, start_column, time_column):
        fuser = Fusion(lambda start, end : 33.0/1000)
        accel_tuples = []
        gyro_tuples = []
        time_stamps = []
        for line in data:
            datapts = line
            if datapts[0] == '#' or datapts[0] == '': # Either remove this, or mention somewhere that lines starting with '#' will be ignored 
                continue
            time_stamps.append(float(datapts[time_column]) / 1000.0)
            accel = (float(datapts[start_column]) / 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+1])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+2])/ 1000 * DEGREES_PER_RADIAN)
            gyro = (float(datapts[start_column+3])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+4])/ 1000 * DEGREES_PER_RADIAN, float(datapts[start_column+5])/ 1000 * DEGREES_PER_RADIAN)
            accel_tuples.append(accel)
            gyro_tuples.append(gyro)
        quaternion_list = []
        for count in range(len(accel_tuples)):
            fuser.update_nomag(accel_tuples[count], gyro_tuples[count], time_stamps[count]) # Note blocking mag read <- What does this mean?
            quaternion_list.append(fuser.q)
        return quaternion_list