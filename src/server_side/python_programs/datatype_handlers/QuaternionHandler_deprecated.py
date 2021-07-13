from .DatatypeHandler import DatatypeHandler

class QuaternionHandler(DatatypeHandler):
    def get_quaternions(self, data, start_column, time_column):
        quaternion_list = []
        for line in data:
            datapts = line.split(' ')
            if datapts[0] == '#' or datapts[0] == '':
                continue
            quat = [float(datapts[start_column]) / 1000, float(datapts[start_column+1])/ 1000, float(datapts[start_column+2])/ 1000, float(datapts[start_column+3]) / 1000]
            quaternion_list.append(quat)
        return quaternion_list