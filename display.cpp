#include "pxt.h"
#include <vector>
using namespace pxt;

#ifndef PXT_CREATE_BUFFER
#define PXT_CREATE_BUFFER(data, len) ManagedBuffer(data, len).leakData()
#endif

#define DC uBit.io.P12   // MICROBIT_PIN_P12
#define CS uBit.io.P8    // MICROBIT_PIN_P8
#define RESET uBit.io.P2 // MICROBIT_PIN_P2
#define BUSY uBit.io.P16 // MICROBIT_PIN_P16

#define DRIVER_CONTROL 0x01
#define GATE_VOLTAGE 0x03
#define SOURCE_VOLTAGE 0x04
#define DISPLAY_CONTROL 0x07
#define NON_OVERLAP 0x0B
#define BOOSTER_SOFT_START 0x0C
#define GATE_SCAN_START 0x0F
#define DEEP_SLEEP 0x10
#define DATA_MODE 0x11
#define SW_RESET 0x12
#define TEMP_WRITE 0x1A
#define TEMP_READ 0x1B
#define TEMP_CONTROL 0x1C
#define TEMP_LOAD 0x1D
#define MASTER_ACTIVATE 0x20
#define DISP_CTRL1 0x21
#define DISP_CTRL2 0x22
#define WRITE_RAM 0x24
#define WRITE_ALTRAM 0x26
#define READ_RAM 0x25
#define VCOM_SENSE 0x28
#define VCOM_DURATION 0x29
#define WRITE_VCOM 0x2C
#define READ_OTP 0x2D
#define WRITE_LUT 0x32
#define WRITE_DUMMY 0x3A
#define WRITE_GATELINE 0x3B
#define WRITE_BORDER 0x3C
#define SET_RAMXPOS 0x44
#define SET_RAMYPOS 0x45
#define SET_RAMXCOUNT 0x4E
#define SET_RAMYCOUNT 0x4F

#define CS_ACTIVE 0
#define CS_INACTIVE 1
#define DC_DATA 1
#define DC_COMMAND 0

constexpr uint8_t luts[30] = {
    0x02, 0x02, 0x01, 0x11, 0x12, 0x12, 0x22, 0x22, 0x66, 0x69,
    0x69, 0x59, 0x58, 0x99, 0x99, 0x88, 0x00, 0x00, 0x00, 0x00,
    0xF8, 0xB4, 0x13, 0x51, 0x35, 0x51, 0x51, 0x19, 0x01, 0x00
};

constexpr uint8_t WIDTH = 200;
constexpr uint8_t HEIGHT = 150;

constexpr uint8_t COLS = 200;
constexpr uint8_t ROWS = 150;
constexpr uint8_t OFFSET_X = 0;
constexpr uint8_t OFFSET_Y = 0;

//uint8_t *buf_b;
//uint8_t *buf_r;
uint8_t *buf;

uint8_t *g_expand_hi;
uint8_t *g_expand_lo;


SPI spi(MOSI, MISO, SCK);

bool initialized = false;

bool upside_down = false;

namespace ePaper {

    void busyWait() {
        while(BUSY.getDigitalValue()) {
            uBit.sleep(10);
        }
    }

    void spiCommand(uint8_t command, const uint8_t *data, int len) {
        CS.setDigitalValue(CS_INACTIVE);
        CS.setDigitalValue(CS_ACTIVE);
        DC.setDigitalValue(DC_COMMAND);
        spi.write(command);
        if (len > 0) {
            CS.setDigitalValue(CS_INACTIVE);
            CS.setDigitalValue(CS_ACTIVE);
            DC.setDigitalValue(DC_DATA);
            for(auto x = 0; x < len; x++){
                spi.write(data[x]);
            }
        }
        CS.setDigitalValue(CS_INACTIVE);
    }

    void spiCommand(uint8_t command) {
        spiCommand(command, NULL, 0);
    }

    void spiCommand(uint8_t command, std::initializer_list<uint8_t> data) {
        CS.setDigitalValue(CS_INACTIVE);
        CS.setDigitalValue(CS_ACTIVE);
        DC.setDigitalValue(DC_COMMAND);
        spi.write(command);
        CS.setDigitalValue(CS_INACTIVE);
        CS.setDigitalValue(CS_ACTIVE);
        DC.setDigitalValue(DC_DATA);
        for(auto c : data){
            spi.write(c);
        }
        CS.setDigitalValue(CS_INACTIVE);
    }

    void spiData(uint8_t *data, int len) {
        CS.setDigitalValue(CS_INACTIVE);
        CS.setDigitalValue(CS_ACTIVE);
        DC.setDigitalValue(DC_DATA);
	    for(auto x = 0; x < len; x++){
            spi.write(data[x]);
	    }
        CS.setDigitalValue(CS_INACTIVE);
    }

    void spiDataStart() {
        CS.setDigitalValue(CS_INACTIVE);
        CS.setDigitalValue(CS_ACTIVE);
        DC.setDigitalValue(DC_DATA);
    }
    void spiData(uint8_t data) {
        busyWait();
        spi.write(data);
    }
    void spiDataEnd() {
        CS.setDigitalValue(CS_INACTIVE);
    }

    //%
    void clear(uint8_t color) {
        //memset(buf_b, 0x00, (COLS / 8) * ROWS);
        //memset(buf_r, color, (COLS / 8) * ROWS);
        memset(buf, color, (COLS / 8) * ROWS);
        //memset(buf, color, (COLS / 8) * ROWS);
        //memset(buf, color, (COLS / 8) * ROWS);
        //memset(buf, color, (COLS / 8) * ROWS);
    }

    //%
    void setPixel(int y, int x, int color) {
            if(y >= WIDTH) return;
            if(x >= HEIGHT) return;
            if (!upside_down) {
                x = HEIGHT - x;
                y = WIDTH - y;
            } 
            y += OFFSET_Y;
            y = COLS - 1 - y;
            uint8_t shift = 7 - (y % 8);
            y /= 8;
            uint16_t offset = (x * (COLS / 8)) + y;

            uint8_t byte_b = buf[offset] | (0b1 << shift);
            //uint8_t byte_b = buf_b[offset] | (0b1 << shift);
            //uint8_t byte_r = buf_r[offset] & ~(0b1 << shift);

            //if(color == 2) {
            //    byte_r |= 0b1 << shift;
            //}
            if(color == 1) {
                byte_b &= ~(0b1 << shift);
            }

            buf[offset] = byte_b;
            //buf_b[offset] = byte_b;
            //buf_r[offset] = byte_r;
    }

    void scale2x() {
        uint8_t x;
        uint8_t y;
        uint8_t r;
        uint8_t v;

        // Bytes per source row (ceil)
        uint8_t src_stride = (COLS + 7) / 8;

        for (y = 0; y < ROWS; ++y) {
            // Write the expanded row twice for vertical doubling
            {
                for (r = 0; r < 2; ++r) {
                    for (x = 0; x < src_stride; ++x) {
                        v  = buf[(y * src_stride) + x];
                        spiData(g_expand_hi[v]);
                        spiData(g_expand_lo[v]);
                    } 
                }
            }
        }
    }

    //%
    void show_half() {
        spiCommand(WRITE_RAM);
        //spiData(buf_b, (COLS / 8) * ROWS);
        spiDataStart();
        scale2x();
        spiDataEnd();
    }

    //%
    void show() {
        spiCommand(WRITE_RAM);
        //spiData(buf_b, (COLS / 8) * ROWS);
        spiDataStart();
        scale2x();
        spiDataEnd();
        //spiData(buf, (COLS / 8) * ROWS);
        spiCommand(WRITE_ALTRAM);
        //spiData(buf_r, (COLS / 8) * ROWS);
        spiDataStart();
        scale2x();
        spiDataEnd();
        //spiData(buf, (COLS / 8) * ROWS);
    }

    //%
    void update() {
        spiCommand(0x22, {0xF7}); 
        spiCommand(0x20);
        busyWait(); 
    }

    //%
    void update_fast() {
        spiCommand(0x22, {0xC7}); 
        spiCommand(0x20);
        busyWait(); 
    }

    //%
    void update_partial() {
        spiCommand(0x22, {0xFF}); 
        spiCommand(0x20);
        busyWait(); 
    }



    void reset() {
        //RESET.setDigitalValue(1);
        uBit.sleep(10);
        RESET.setDigitalValue(0);
        uBit.sleep(10);
        RESET.setDigitalValue(1);
        uBit.sleep(10);
    }

    

    //%
    void fast_init() {
        spi.format(8,0);
        spi.frequency(1000000);

        reset();

        busyWait();
        spiCommand(0x12);
        //uBit.sleep(5);
        busyWait();

        spiCommand(0x21, {0x40, 0x00});
        spiCommand(0x3C, {0x05});
        spiCommand(0x1A, {0x6E});
        spiCommand(0x22, {0x91});
        spiCommand(0x20);
        busyWait();

        spiCommand(0x11, {0x01});
        spiCommand(0x44, {0x00, 0x31});
        spiCommand(0x45, {0x2B, 0x01, 0x00, 0x00});
        spiCommand(0x4E, {0x00});
        spiCommand(0x4F, {0x2B, 0x01});
    }

    //%
    void slow_init() {
        spi.format(8,0);
        spi.frequency(1000000);
        
        reset();

        busyWait();
        spiCommand(0x12);
        //uBit.sleep(5);
        busyWait();

        spiCommand(0x21, {0x40, 0x00});
        spiCommand(0x3C, {0x05});
        spiCommand(0x11, {0x01});
        spiCommand(0x44, {0x00, 0x31});
        spiCommand(0x45, {0x2B, 0x01, 0x00, 0x00});
        spiCommand(0x4E, {0x00});
        spiCommand(0x4F, {0x2B, 0x01});
    }
    
    //%
    void sleep() {
        spiCommand(0x10,{0x01});
        uBit.sleep(100);
    }

    //%
    void init(bool _upside_down) {
        if(initialized) return;

        upside_down = _upside_down;
        
        // Initialize translation arrays:
        g_expand_hi = (uint8_t *)malloc(256);
        g_expand_lo = (uint8_t *)malloc(256);
        
        for (int v = 0; v < 256; ++v) {
            uint16_t out16 = 0U; // build 16-bit pattern in an unsigned int
            for (int i = 0; i < 8; ++i) {
                int bit = (v >> (7 - i)) & 1; // MSB-first
                out16 <<= 2;
                if (bit) out16 |= 0x3U;       // duplicate horizontally
            }
            g_expand_hi[v] = (uint8_t)((out16 >> 8) & 0xFFU);
            g_expand_lo[v] = (uint8_t)(out16 & 0xFFU);
        }
           
        buf = (uint8_t *)malloc((COLS / 8) * ROWS);
        //buf_b = (uint8_t *)malloc((COLS / 8) * ROWS);
        //buf_r = (uint8_t *)malloc((COLS / 8) * ROWS);

        clear(0xFF);

        slow_init();

        
        /*
        int x;
        int y;
        spiCommand(WRITE_RAM);
        spiDataStart();
        for(y=0; y<ROWS*2; y++) {
            for(x=0; x<(COLS*2/8); x++) {
                if ((y % 2) == 0) spiData(0xFF); else spiData(0x00);
                //spiData(0x00);
            }
        }
        spiDataEnd();
        */

        /*
        spiCommand(WRITE_RAM);
        spiDataStart();
        for(int i=0; i<15000; i++) {
                if ((i % 2) == 0) spiData(0xFF); else spiData(0x00);
        }
        spiDataEnd();
        */
        /*
        spiCommand(WRITE_ALTRAM);
        spiDataStart();
        for(int i=0; i<15000; i++) {
                spiData(0xFF);
        }
        spiDataEnd();
        */
        /*
        spiCommand(WRITE_RAM);
        spiDataStart();
        for(int y=0; y<ROWS; y++) {
            for(int x=0; x<(COLS/8); x++) {
                if ((y % 2) == 0) spiData(0xFF); else spiData(0x00);
                //spiData(0xFF);
            }
        }
        spiDataEnd();
        spiCommand(WRITE_ALTRAM);
        spiDataStart();
        for(int y=0; y<ROWS; y++) {
            for(int x=0; x<(COLS/8); x++) {
                if ((y % 2) == 0) spiData(0xFF); else spiData(0x00);
                //spiData(0xFF);
            }
        }
        spiDataEnd();
        */
        show();
        update();
        sleep();
        fast_init();
        initialized = true;
    }

}
