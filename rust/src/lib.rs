mod utils;

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use crate::utils::set_panic_hook;

#[wasm_bindgen]
pub fn endianness() -> String {
    set_panic_hook();
    if cfg!(target_endian = "big") {
        "Big endian".to_string()
    } else {
        "Little endian".to_string()
    }
}
