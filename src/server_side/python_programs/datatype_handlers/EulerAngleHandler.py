from .DatatypeHandler import DatatypeHandler
import numpy as np

def eulerToQuaternion(roll, pitch, yaw):
        print("Roll={0}\nPitch={1}\nYaw={2}".format(roll, pitch, yaw))
        cr = np.cos(roll * 0.5)
        sr = np.sin(roll * 0.5)
        cp = np.cos(pitch * 0.5)
        sp = np.sin(pitch * 0.5)
        cy = np.cos(yaw *  0.5)
        sy = np.sin(yaw * 0.5)

        # https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
        w = cr * cp * cy + sr * sp * sy
        x = sr * cp * cy - cr * sp * sy
        y = cr * sp * cy + sr * cp * sy
        z = cr * cp * sy - sr * sp * cy

        return np.array([w,x,y,z])

class EulerAngleHandler(DatatypeHandler):
    def get_quaternions(self, data, start_column, time_column):
        """
        Overrides get_quaternions method of DatatypeHandler.
        Assumes input data is in the form of Euler angles in degrees,
        in (Roll, Pitch, Yaw) order.
        """
        RADIANS_PER_DEGREE = (2 * np.pi) / 360.0
        quaternion_list = []
        for line in data:
            if len(line) <= start_column + 2 or line[0] == '#':
                continue
            roll_raw = line[start_column]
            pitch_raw = line[start_column+1]
            yaw_raw = line[start_column+2]
            if roll_raw == 'NONE' or pitch_raw == 'NONE' or yaw_raw == 'NONE':
                quaternion_list.append(np.array([1,0,0,0]))
                continue
            roll = float(roll_raw) * RADIANS_PER_DEGREE
            pitch = float(pitch_raw) * RADIANS_PER_DEGREE
            yaw = float(yaw_raw) * RADIANS_PER_DEGREE
            quaternion_list.append(eulerToQuaternion(roll, pitch, yaw))
        return quaternion_list
