from .DatatypeHandler import DatatypeHandler
import numpy as np

def ham_product(q1, q2):
    """ Returns Hamilton product q1q2 for two quaternions. Returns as
    a new Numpy array and doesn't modify input arrays.
    Source: https://en.wikipedia.org/wiki/Quaternion#Hamilton_product
    """
    prod = np.empty(4)
    prod[0] = q1[0]*q2[0] - q1[1]*q2[1] - q1[2]*q2[2] - q1[3]*q2[3]
    prod[1] = q1[0]*q2[1] + q1[1]*q2[0] + q1[2]*q2[3] - q1[3]*q2[2]
    prod[2] = q1[0]*q2[2] - q1[1]*q2[3] + q1[2]*q2[0] + q1[3]*q2[1]
    prod[3] = q1[0]*q2[3] + q1[1]*q2[2] - q1[2]*q2[1] + q1[3]*q2[0]
    return prod

class DeltaQuatHandler(DatatypeHandler):
    def get_quaternions(self, data, start_column, time_column):
        """
        Overriddes parent method. 
        Assumes input data is in the form of quaternions representing
        change in orientation from the previous sample.
        """
        quaternion_list = []
        current_quat = np.array([1,0,0,0])
        for line in data:
            if len(line) <= start_column + 3 or line[0] == '#':
                continue
            new_quat = np.empty(4)
            for i in range(4):
                new_quat[i] = line[start_column + i]
            current_quat = ham_product(new_quat, current_quat)
            quaternion_list.append(current_quat)
        return quaternion_list
