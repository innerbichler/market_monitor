use rusqlite::{Connection, Result};

#[derive(Debug)]
pub struct Beverage{
    product_name: String,
    company_name: String,
    product_type: String,
    packaging_type: String,
    price_per_liter: f32,
}

pub fn insert_beverage(product_name: &str, company_name: &str, product_type: &str, packaging_type: &str, price_per_liter: f32) -> Result<()> {
    let conn = Connection::open("beverages.db")?;
    conn.execute(
        "INSERT INTO beverage(product_name, company_name, product_type, packaging_type, price_per_liter) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        (&product_name, &company_name, &product_type, &packaging_type, &price_per_liter),
    )?;
    Ok(())
}

pub fn select_all_beverages() -> Result<()> {
    let conn = Connection::open("beverages.db")?;
    let mut stmt = conn.prepare("SELECT * FROM beverage")?;
    let bev_iter = stmt.query_map([], |row| {
        Ok(Beverage{
            product_name: row.get(1)?,
            company_name: row.get(2)?,
            product_type: row.get(3)?,
            packaging_type: row.get(4)?,
            price_per_liter: row.get(5)?,
        })
    })?;

    for beverage in bev_iter {
        println!("Found beverage {:?}", beverage.unwrap());
    }
    Ok(())
}
