import './CardItem.css'
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const oppColumns = [{
    label: "TIME",
    multiplier: 1,
    unit: "ms"
},{
    label: "(ACC) RKN^ accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RKN^ accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RKN^ accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) HIP accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) HIP accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) HIP accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LUA^ accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LUA^ accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LUA^ accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RUA_ accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RUA_ accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RUA_ accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LH accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LH accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LH accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) BACK accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) BACK accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) BACK accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RKN_ accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RKN_ accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RKN_ accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RWR accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RWR accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RWR accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RUA^ accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RUA^ accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RUA^ accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LUA_ accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LUA_ accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LUA_ accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LWR accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LWR accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LWR accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RH accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RH accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) RH accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(IMU) BACK accX",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) BACK accY",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) BACK accZ",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) BACK gyroX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) BACK gyroY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) BACK gyroZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) BACK magneticX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) BACK magneticY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) BACK magneticZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) BACK Quaternion1",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) BACK Quaternion2",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) BACK Quaternion3",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) BACK Quaternion4",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) RUA accX",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) RUA accY",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) RUA accZ",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) RUA gyroX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RUA gyroY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RUA gyroZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RUA magneticX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RUA magneticY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RUA magneticZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RUA Quaternion1",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) RUA Quaternion2",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) RUA Quaternion3",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) RUA Quaternion4",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) RLA accX",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) RLA accY",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) RLA accZ",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) RLA gyroX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RLA gyroY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RLA gyroZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RLA magneticX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RLA magneticY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RLA magneticZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) RLA Quaternion1",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) RLA Quaternion2",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) RLA Quaternion3",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) RLA Quaternion4",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) LUA accX",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) LUA accY",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) LUA accZ",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) LUA gyroX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LUA gyroY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LUA gyroZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LUA magneticX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LUA magneticY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LUA magneticZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LUA Quaternion1",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) LUA Quaternion2",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) LUA Quaternion3",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) LUA Quaternion4",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) LLA accX",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) LLA accY",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) LLA accZ",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) LLA gyroX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LLA gyroY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LLA gyroZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LLA magneticX",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LLA magneticY",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LLA magneticZ",
    multiplier: 0.001,
    unit: "unknown"
},{
    label: "(IMU) LLA Quaternion1",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) LLA Quaternion2",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) LLA Quaternion3",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) LLA Quaternion4",
    multiplier: 0.001,
    unit: "none"
},{
    label: "(IMU) L-SHOE EuX",
    multiplier: 1,
    unit: "degrees"
},{
    label: "(IMU) L-SHOE EuY",
    multiplier: 1,
    unit: "degrees"
},{
    label: "(IMU) L-SHOE EuZ",
    multiplier: 1,
    unit: "degrees"
},{
    label: "(IMU) L-SHOE Nav_Ax",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) L-SHOE Nav_Ay",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) L-SHOE Nav_Az",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) L-SHOE Body_Ax",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) L-SHOE Body_Ay",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) L-SHOE Body_Az",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) L-SHOE AngVelBodyFrameX",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) L-SHOE AngVelBodyFrameY",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) L-SHOE AngVelBodyFrameZ",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) L-SHOE AngVelNavFrameX",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) L-SHOE AngVelNavFrameY",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) L-SHOE AngVelNavFrameZ",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) L-SHOE Compass",
    multiplier: 1,
    unit: "degrees"
},{
    label: "(IMU) R-SHOE EuX",
    multiplier: 1,
    unit: "degrees"
},{
    label: "(IMU) R-SHOE EuY",
    multiplier: 1,
    unit: "degrees"
},{
    label: "(IMU) R-SHOE EuZ",
    multiplier: 1,
    unit: "degrees"
},{
    label: "(IMU) R-SHOE Nav_Ax",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) R-SHOE Nav_Ay",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) R-SHOE Nav_Az",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) R-SHOE Body_Ax",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) R-SHOE Body_Ay",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) R-SHOE Body_Az",
    multiplier: 0.098,
    unit: "milli g"
},{
    label: "(IMU) R-SHOE AngVelBodyFrameX",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) R-SHOE AngVelBodyFrameY",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) R-SHOE AngVelBodyFrameZ",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) R-SHOE AngVelNavFrameX",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) R-SHOE AngVelNavFrameY",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) R-SHOE AngVelNavFrameZ",
    multiplier: 0.001,
    unit: "mm/s"
},{
    label: "(IMU) R-SHOE Compass",
    multiplier: 1,
    unit: "degrees"
},{
    label: "(ACC) CUP accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) CUP accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) CUP accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) CUP gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) CUP gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) SALAMI accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) SALAMI accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) SALAMI accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) SALAMI gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) SALAMI gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) WATER accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) WATER accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) WATER accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) WATER gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) WATER gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) CHEESE accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) CHEESE accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) CHEESE accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) CHEESE gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) CHEESE gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) BREAD accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) BREAD accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) BREAD accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) BREAD gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) BREAD gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) KNIFE1 accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) KNIFE1 accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) KNIFE1 accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) KNIFE1 gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) KNIFE1 gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) MILK accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) MILK accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) MILK accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) MILK gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) MILK gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) SPOON accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) SPOON accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) SPOON accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) SPOON gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) SPOON gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) SUGAR accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) SUGAR accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) SUGAR accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) SUGAR gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) SUGAR gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) KNIFE2 accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) KNIFE2 accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) KNIFE2 accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) KNIFE2 gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) KNIFE2 gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) PLATE accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) PLATE accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) PLATE accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) PLATE gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) PLATE gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) GLASS accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) GLASS accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) GLASS accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) GLASS gyroX",
    multiplier: 1,
    unit: "unknown"
},{
    label: "(ACC) GLASS gyroY",
    multiplier: 1,
    unit: "unknown"
},{
    label: "REED SWITCH DISHWASHER S1",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH FRIDGE S3",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH FRIDGE S2",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH FRIDGE S1",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH MIDDLEDRAWER S1",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH MIDDLEDRAWER S2",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH MIDDLEDRAWER S3",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH LOWERDRAWER S3",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH LOWERDRAWER S2",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH UPPERDRAWER",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH DISHWASHER S3",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH LOWERDRAWER S1",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "REED SWITCH DISHWASHER S2",
    multiplier: 1,
    unit: "logical (0/1)"
},{
    label: "(ACC) DOOR1 accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) DOOR1 accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) DOOR1 accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LAZYCHAIR accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LAZYCHAIR accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LAZYCHAIR accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) DOOR2 accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) DOOR2 accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) DOOR2 accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) DISHWASHER accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) DISHWASHER accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) DISHWASHER accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) UPPERDRAWER accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) UPPERDRAWER accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) UPPERDRAWER accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LOWERDRAWER accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LOWERDRAWER accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) LOWERDRAWER accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) MIDDLEDRAWER accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) MIDDLEDRAWER accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) MIDDLEDRAWER accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) FRIDGE accX",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) FRIDGE accY",
    multiplier: 1,
    unit: "milli g"
},{
    label: "(ACC) FRIDGE accZ",
    multiplier: 1,
    unit: "milli g"
},{
    label: "LTAG 1 X",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 1 Y",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 1 Z",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 2 X",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 2 Y",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 2 Z",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 3 X",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 3 Y",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 3 Z",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 4 X",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 4 Y",
    multiplier: 1,
    unit: "mm"
},{
    label: "LTAG 4 Z",
    multiplier: 1,
    unit: "mm"
}, { 
    label: "Locomotion"
},{ 
    label: "HL_Activity"
},{ 
    label: "LL_Left_Arm"
},{ 
    label: "LL_Left_Arm_Object"
},{ 
    label: "LL_Right_Arm"
},{ 
    label: "LL_Right_Arm_Object"
},{ 
    label: "ML_Both_Arms"
}]

const labelLegend = { 
    0: "none",
    1: "Stand",
    2: "Walk",
    4: "Sit",
    5: "Lie",
    101: "Relaxing",
    102: "Coffee time",
    103: "Early morning",
    104: "Cleanup",
    105: "Sandwich time",
    201: "unlock",
    202: "stir",
    203: "lock",
    204: "close",
    205: "reach",
    206: "open",
    207: "sip",
    208: "clean",
    209: "bite",
    210: "cut",
    211: "spread",
    212: "release",
    213: "move",
    301: "Bottle",
    302: "Salami",
    303: "Bread",
    304: "Sugar",
    305: "Dishwasher",
    306: "Switch",
    307: "Milk",
    308: "Drawer3 (lower)",
    309: "Spoon",
    310: "Knife cheese",
    311: "Drawer2 (middle)",
    312: "Table",
    313: "Glass",
    314: "Cheese",
    315: "Chair",
    316: "Door1",
    317: "Door2",
    318: "Plate",
    319: "Drawer1 (top)",
    320: "Fridge",
    321: "Cup",
    322: "Knife salami",
    323: "Lazychair",
    401: "unlock",
    402: "stir",
    403: "lock",
    404: "close",
    405: "reach",
    406: "open",
    407: "sip",
    408: "clean",
    409: "bite",
    410: "cut",
    411: "spread",
    412: "release",
    413: "move",
    501: "Bottle",
    502: "Salami",
    503: "Bread",
    504: "Sugar",
    505: "Dishwasher",
    506: "Switch",
    507: "Milk",
    508: "Drawer3 (lower)",
    509: "Spoon",
    510: "Knife cheese",
    511: "Drawer2 (middle)",
    512: "Table",
    513: "Glass",
    514: "Cheese",
    515: "Chair",
    516: "Door1",
    517: "Door2",
    518: "Plate",
    519: "Drawer1 (top)",
    520: "Fridge",
    521: "Cup",
    522: "Knife salami",
    523: "Lazychair",
    406516: "Open Door 1",
    406517: "Open Door 2",
    404516: "Close Door 1",
    404517: "Close Door 2",
    406520: "Open Fridge",
    404520: "Close Fridge",
    406505: "Open Dishwasher",
    404505: "Close Dishwasher",
    406519: "Open Drawer 1",
    404519: "Close Drawer 1",
    406511: "Open Drawer 2",
    404511: "Close Drawer 2",
    406508: "Open Drawer 3",
    404508: "Close Drawer 3",
    408512: "Clean Table",
    407521: "Drink from Cup",
    405506: "Toggle Switch"
}

// NOTE: See http://tsitsul.in/blog/coloropt/
const colors = [    
    "#ebac23",
    "#b80058",
    "#008cf9",
    "#006e00",
    "#00bbad",
    "#d163e6",
    "#b24502",
    "#ff9287",
    "#5954d6",
    "#00c6f8",
    "#878500",
    "#00a76c",
    "#bdbdbd" 
];

const LABEL_COL_BEGIN = 243;

export default function CardItem(props) {

    const getLabelCard = (options, data, lineNum) => {
        let columnIndices = [];
        for (let i = options.startCol; i < options.startCol + options.columnCount; i++) {
            columnIndices.push(i);
        }
                    
        return (
            <div>
               { columnIndices.map((value, index) => {
                   return (<div key={index}>
                       {`${oppColumns[value].label}: ${labelLegend[data[lineNum][value]]}`}
                   </div>)
               }) }
            </div>
        )

    }

    const getGraphCard = (options, data, lineNum) => {

        let graphData = [];

        let dataNames = [];

        let startRow = Math.max(0, lineNum - options.rowsBefore);
        let endRow = Math.min(data.length, lineNum + options.rowsAfter)

        // Relies on there being activity data embedded in the data file that we're looking at.
        try {
            for (let row = startRow; row <= endRow; row++) {
                let obj = {
                    name: data[row][0], // time
                }
                for (let i = options.startCol; i < options.startCol + options.columnCount; i++) {
                    obj[oppColumns[i].label] = data[row][i] * oppColumns[i].multiplier;
                    if (row === startRow) dataNames.push(oppColumns[i].label);
                }
                graphData.push(obj);
            }
        } catch (error) {
            return null;
        }

        return (
            <ResponsiveContainer width="100%" aspect={4.0/3.0}>
                <LineChart
                    data={graphData}
                    margin={{
                      top: 0,
                      right: 0,
                      left: -25,
                      bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />

                    {dataNames.map((key, index) => <Line 
                        type="monotone" 
                        dataKey={key} 
                        key={key} 
                        stroke={colors[index % colors.length]}
                        dot={false}
                    />)}

                </LineChart>
            </ResponsiveContainer>
        )

    }

    return (
      <div className="cardItem" style={{ float: props.floatLeft ? "left" : "none"}}>
            { 
            props.filePath.indexOf("smartphone-dataset") === -1 ?
                props.options.startCol < LABEL_COL_BEGIN 
                    && props.options.columnCount + props.options.startCol <= LABEL_COL_BEGIN  ? getGraphCard(props.options, props.data.current, props.lineNumber) :
                props.options.startCol >= LABEL_COL_BEGIN 
                    && props.options.startCol + props.options.columnCount < oppColumns.length ? getLabelCard(props.options, props.data.current, props.lineNumber) :
                "Invalid columns specified."
            :
            <div>{
                Array(props.options.columnCount).fill(0).map((v, index) => (
                    <div key={index}>
                        {props.data.current[props.lineNumber][props.options.startCol + index]}
                        <br />
                    </div>
                ))
                }</div>
            }
      </div>  
    );
}