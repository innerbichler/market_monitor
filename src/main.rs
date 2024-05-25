#[macro_use] extern crate rocket;
use rocket::fs::FileServer;
use rocket::serde::{Serialize, json::Json};
use chrono;
mod setup_db;
mod db_control;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct ProductType{
    name: String,
    color: String,
}

#[get("/insert_beverage")]
fn insert_beverage(){
    let _test = match db_control::insert_beverage(
        db_control::Beverage{
        product_name: "Schwechater".to_string(),
        company_name: "Billa".to_string(),
        product_type: "Bier".to_string(),
        packaging_type: "Dose".to_string(),
        price_per_liter: 1.66,
        timestamp: chrono::Local::now().to_utc().to_string()
        }
        ){
        Ok(_) => println!("Successfully Inserted Beverage"),
        Err(e) => println!("Error with inserting {}", e),
    };
}

#[get("/get_search")]
fn get_search() -> Json<Vec<db_control::Beverage>>{
    let bevs: Vec<db_control::Beverage> = match db_control::select_all_beverages(){
        Ok(bevs) => bevs,
        Err(_) => panic!("Error retrieving beverages")
    };
    Json(bevs)
}

#[get("/get_product_types")]
fn get_products() -> Json<Vec<ProductType>> {
    let mut products: Vec<ProductType> = Vec::with_capacity(3);
    products.push(ProductType{
        name: String::from("Wein"),
        color: String::from("#A700C2")
    });
    products.push(ProductType{
        name: String::from("Bier"),
        color: String::from("#D47300")
    });
    products.push(ProductType{
        name: String::from("Milch"),
        color: String::from("#BCBCBC")
    });
    Json(products)
}

#[launch]
fn rocket() -> _ {
    setup_db::setup_db_main();
    rocket::build()
        .mount("/", routes![insert_beverage])
        .mount("/", routes![get_search])
        .mount("/", routes![get_products])
        .mount("/", FileServer::from("static"))
}
