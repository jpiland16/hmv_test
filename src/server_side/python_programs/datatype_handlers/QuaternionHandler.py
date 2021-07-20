from .DatatypeHandler import DatatypeHandler

class QuaternionHandler(DatatypeHandler):
    def get_quaternions(self, data, start_column, time_column):
        """ Overrides get_quaternions method of DatatypeHandler. """
        quaternion_list = []
        for line in data:
            if line[0] == '#' or line[0] == '':
                continue
            quat = [float(line[start_column]) / 1000, float(line[start_column+1])/ 1000, float(line[start_column+2])/ 1000, float(line[start_column+3]) / 1000]
            quaternion_list.append(quat)
        return quaternion_list