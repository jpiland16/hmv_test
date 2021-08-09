from .DatatypeHandler import DatatypeHandler
import sys

class QuaternionHandler(DatatypeHandler):
    def get_quaternions(self, data, start_column, time_column):
        """ Overrides get_quaternions method of DatatypeHandler. """
        quaternion_list = []
        for i in range(len(data)):
            line = data[i]
            if line[0] == '#' or line[0] == '':
                continue
            try:
                quat = [float(line[start_column]) / 1000, float(line[start_column+1])/ 1000, float(line[start_column+2])/ 1000, float(line[start_column+3]) / 1000]
                quaternion_list.append(quat)
            except ValueError:
                print("ValueError encountered in QuaternionHandler!", file=sys.stderr)
                print("Row index: {0}".format(i), file=sys.stderr)
                print("Relevant string tokens: {0}".format(line[start_column:start_column+4]), file=sys.stderr)
                raise
        return quaternion_list