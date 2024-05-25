use rusqlite::{Connection, Result};
use rocket::serde::{Serialize};
use chrono;

#[derive(Debug)]
#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Beverage{
    pub product_name: String,
    pub company_name: String,
    pub product_type: String,
    pub packaging_type: String,
    pub price_per_liter: f32,
    pub timestamp: String,
}

pub fn insert_beverage(bev: Beverage) -> Result<()> {
    let conn = Connection::open("beverages.db")?;
    conn.execute(
        "INSERT INTO beverage(product_name, company_name, product_type, packaging_type, price_per_liter, timestamp) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        (bev.product_name, bev.company_name, bev.product_type, bev.packaging_type, bev.price_per_liter, bev.timestamp),
    )?;
    Ok(())
}

pub fn select_all_beverages() -> Result<Vec<Beverage>> {
    let conn = Connection::open("beverages.db")?;
    let mut stmt = conn.prepare("SELECT * FROM beverage")?;
    let bev_iter = stmt.query_map([], |row| {
        Ok(Beverage{
            product_name: row.get(1)?,
            company_name: row.get(2)?,
            product_type: row.get(3)?,
            packaging_type: row.get(4)?,
            price_per_liter: row.get(5)?,
            timestamp: row.get(6)?,
        })
    })?;

    let mut bevs: Vec<Beverage> = Vec::new();
    for beverage in bev_iter {
        bevs.push(beverage.unwrap());
    }
    Ok(bevs)
}
