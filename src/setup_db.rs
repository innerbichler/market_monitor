use rusqlite::{Connection, Result};

pub fn setup_db_main(){

    match setup_db(){
        Ok(_) => println!("Successfully setup db"),
        Err(e) => println!("error with setup db  {}", e)
    }
}

fn setup_db() -> Result<()> {
    let conn = Connection::open("beverages.db")?;

    conn.execute(
        "create table if not exists beverage (
             id integer primary key,
             product_name text not null,
             company_name text not null,
             product_type text not null,
             packaging_type text not null,
             price_per_liter real not null,
             timestamp text not null
         )",
         (),
    )?;

    Ok(())
}
