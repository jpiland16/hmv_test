# fusionlcd.py Test for asynchronous sensor fusion on Pyboard. Uses LCD display and uasyncio.
# Author: Peter Hinch
# Released under the MIT License (MIT) See LICENSE
# Copyright (c) 2017-2020 Peter Hinch

# Requires:
# uasyncio V3 (Included in daily builds and release builds later than V1.12).
# MPU9150 on X position
# Normally open pushbutton connected between pin Y7 and ground
# LCD driver alcd.py uasyncio V3 version from
# https://github.com/peterhinch/micropython-async/blob/master/v3/as_drivers/hd44780/alcd.py
# From https://github.com/micropython-IMU/micropython-mpu9x50:
# imu.py, mpu9150.py, vector3d.py
# From this repo: deltat.py fusion_async.py

# Hitachi HD44780 2 row LCD display wired using 4 bit data bus as follows:

# Name LCD connector Board
# Rs    4   1 red    Y1
# E     6   2        Y2
# D7   14   3        Y3
# D6   13   4        Y4
# D5   12   5        Y5
# D4   11   6        Y6

from machine import Pin
import uasyncio as asyncio
import gc
from mpu9150 import MPU9150
from fusion_async import Fusion # Using async version
from alcd import LCD, PINLIST   # Library supporting Hitachi LCD module

switch = Pin('Y7', Pin.IN, pull=Pin.PULL_UP) # Switch to ground on Y7

imu = MPU9150('X')              # Attached to 'X' bus, 1 device, disable interruots

lcd = LCD(PINLIST, cols = 24)   # Should work with 16 column LCD

# User coro returns data and determines update rate.
# For 9DOF sensors returns three 3-tuples (x, y, z) for accel, gyro and mag
# For 6DOF sensors two 3-tuples (x, y, z) for accel and gyro
async def read_coro():
    imu.mag_trigger()
    await asyncio.sleep_ms(20)  # Plenty of time for mag to be ready
    return imu.accel.xyz, imu.gyro.xyz, imu.mag_nonblocking.xyz

fuse = Fusion(read_coro)

async def mem_manage():         # Necessary for long term stability
    while True:
        await asyncio.sleep_ms(100)
        gc.collect()
        gc.threshold(gc.mem_free() // 4 + gc.mem_alloc())

async def display():
    lcd[0] = "{:5s}{:5s} {:5s}".format("Yaw","Pitch","Roll")
    while True:
        lcd[1] = "{:4.0f} {:4.0f}  {:4.0f}".format(fuse.heading, fuse.pitch, fuse.roll)
        await asyncio.sleep_ms(500)

async def lcd_task():
    print('Running test...')
    if switch.value() == 1:
        lcd[0] = "Calibrate. Push switch"
        lcd[1] = "when done"
        await asyncio.sleep_ms(100)  # Let LCD coro run
        await fuse.calibrate(lambda : not switch.value())
        print(fuse.magbias)
    await fuse.start()  # Start the update task
    loop = asyncio.get_event_loop()
    loop.create_task(display())

loop = asyncio.get_event_loop()
loop.create_task(mem_manage())
loop.create_task(lcd_task())
loop.run_forever()
