#[macro_use] extern crate rocket;
use rocket::fs::FileServer;
use rocket::serde::{Serialize, json::Json};
mod setup_db;
mod db_control;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct ProductType{
    name: String,
    color: String,
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
        .mount("/", routes![get_products])
        .mount("/", FileServer::from("static"))
}
