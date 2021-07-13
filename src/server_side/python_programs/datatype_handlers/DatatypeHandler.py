class DatatypeHandler:
    def get_quaternions(data, start_column, time_column):
        """
        Use file data to return a list of wxyz quaternions representing sensor 
        orientation.
        Arguments:
        data: a 2-dimensional array of numbers (floats) where data[0] is
        the first sample and data[0][0] is the first number in the first sample.
        This array should contain the entire dataset.
        start_column: the index of the first relevant column for the sensor.
        time_column: the index of the sample's time column.

        Returns:
        quaternion_list: a list of 4-dimensional lists representing the
        (w,x,y,z) of the quaternion orientation of the limb in the 
        corresponding row of the input.
        """
        pass