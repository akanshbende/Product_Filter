import { Box, Stack, Typography } from "@mui/material";
import "./App.css";
// import SideBar from "./Components";
import { useEffect, useState } from "react";
import ProductCard from "./Components/ProductCard";
import PaginationSquared from "./Components/Pagination";
import SideBar from "./Components/SideBar";

// import { Typography } from "antd";

function App() {
  const [item, setItem] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState();

  // console.log(category);

  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = (currentPage - 1) * recordsPerPage;

  const paginatedItems = filteredItems.slice(firstIndex, lastIndex);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getData = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();
      // console.log(data);
      setItem(data.products);
      setFilteredItems(data.products);
      setOriginalItems(data.products);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const productCategories = [...new Set(item?.map((val) => val.category))];
  // console.log(productCategories);

  const ProductPrice = item.map((price) => {
    const numericPrice = parseFloat(price.price);

    if (!isNaN(numericPrice)) {
      return numericPrice;
    }
    return 0;
  });
  if (ProductPrice.length > 0) {
    var maxPrice = Math.max(...ProductPrice);
    var minPrice = Math.min(...ProductPrice);
    // console.log("Max Price:", maxPrice);
    // console.log("Min Price:", minPrice);
  } else {
    console.log("No valid numeric prices found in the array.");
  }

  const filterCategory = (cat) => {
    const newItems = item?.filter((newval) => {
      return (
        newval.category === cat // Filter by category
      );
    });

    setFilteredItems(newItems);
    setCurrentPage(1);
  };

  const filterPrices = (price) => {
    console.log(price);
    const newPriceItems = originalItems.filter((itemPrice) => {
      return price >= itemPrice?.price;
      // console.log(itemPrice.price);
    });

    const filteredPrices = newPriceItems.filter(
      (newval) => newval.category === category
    );
    // console.log(newPriceItems);
    // console.log(category);
    setFilteredItems(filteredPrices);
    // console.log(filteredPrices);
  };
  // console.log("item : ", item);
  // console.log("filterItems : ", filteredItems);

  // const handlePriceRangeChange = (newValue) => {
  //   setSelectedPriceRange(newValue); // Update the selectedPriceRange state
  // };
  return (
    <>
      <Stack direction={{ md: "row" }}>
        <SideBar
          productCategories={productCategories}
          filterCategory={filterCategory}
          setFilteredItems={setFilteredItems}
          item={item}
          minPrice={minPrice}
          maxPrice={maxPrice}
          filterPrices={filterPrices}
          setCategory={setCategory}
        />
        <Stack direction={{ md: "column" }} sx={{ alignItems: "center" }}>
          <Box
            // direction={{ md: "row" }}

            sx={{
              display: "flex",
              width: { md: "80%" },
              // backgroundColor: "#16171d",
              padding: { md: "2rem" },
              flexWrap: "wrap",
              alignItems: "center",
              gap: 4,
              height: { md: "90vh" },
              overflow: "hidden",
            }}
          >
            {Array.isArray(paginatedItems) ? (
              paginatedItems?.map((product, index) => {
                return (
                  <ProductCard
                    key={index}
                    img={product?.images[0]}
                    title={product?.title}
                    desc={product?.description}
                    price={product?.price}
                  />
                );
              })
            ) : (
              <Typography variant="h5" component={"div"}>
                <strong>No data available</strong>
              </Typography>
            )}
          </Box>
          <PaginationSquared
            handlePageChange={handlePageChange}
            filteredItems={filteredItems}
            recordsPerPage={recordsPerPage}
            currentPage={currentPage}
          />
        </Stack>
      </Stack>
    </>
  );
}

export default App;
