import { Box, Stack, Typography } from "@mui/material";
import "./App.css";
// import SideBar from "./Components";
import { useEffect, useState } from "react";
import ProductCard from "./Components/ProductCard";
import PaginationSquared from "./Components/Pagination";
import SideBar from "./Components/SideBar";
import FilterDrawer from "./Components/FilterDrawer";

// import { Typography } from "antd";

function App() {
  const [item, setItem] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState();
  const [value, setValue] = useState([5, 10]);
  // console.log(category);

  const recordsPerPage = 6;
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

  const productCategories =
    [...new Set(item?.map((val) => val.category))] || [];
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
  // console.log(category);
  const filterPrices = (price, category) => {
    console.log(price);
    const newPriceItems = originalItems.filter((itemPrice) => {
      return itemPrice?.price <= price;
    });

    // console.log(newPriceItems);
    // console.log(category);
    if (category) {
      var filteredPrices = newPriceItems.filter(
        (newval) => newval.category === category
      );
      setFilteredItems(filteredPrices);
    } else {
      setFilteredItems(newPriceItems);
    }

    // console.log(filteredPrices);
  };

  const minDistance = 10;
  const handleChange = (event, newValue, activeThumb, category) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
    const newPriceItems = originalItems.filter((itemPrice) => {
      return itemPrice?.price >= newValue[0] && itemPrice?.price <= newValue[1];
    });

    // console.log(newPriceItems);
    // console.log(category);
    if (category) {
      var filteredPrices = newPriceItems.filter(
        (newval) => newval.category === category
      );
      setFilteredItems(filteredPrices);
    } else {
      setFilteredItems(newPriceItems);
    }
  };
  // console.log("item : ", item);
  // console.log("filterItems : ", filteredItems);
  // display: { md: "block", sm: "none", xs: "none" },
  return (
    <>
      <Stack direction={{ md: "row" }}>
        <Stack
          sx={{
            width: { md: "23%" },
            padding: { md: "1rem 1rem" },
            display: { md: "block", sm: "none", xs: "none" },
            backgroundColor: "#BEADFA",
            height: "100vh",
          }}
        >
          <SideBar
            productCategories={productCategories}
            filterCategory={filterCategory}
            setFilteredItems={setFilteredItems}
            item={item}
            minPrice={minPrice}
            maxPrice={maxPrice}
            filterPrices={filterPrices}
            setCategory={setCategory}
            category={category}
            handleChange={handleChange}
            value={value}
          />
        </Stack>
        <FilterDrawer
          productCategories={productCategories}
          filterCategory={filterCategory}
          setFilteredItems={setFilteredItems}
          item={item}
          minPrice={minPrice}
          maxPrice={maxPrice}
          filterPrices={filterPrices}
          setCategory={setCategory}
          category={category}
        />
        <Stack
          direction={{ md: "column" }}
          sx={{
            alignItems: "center",
            borderLeft: { md: "2px solid #505369" },
            width: "100%",
            backgroundColor: "#FFF8C9",
          }}
        >
          {item.length == 0 ? (
            <Stack
              spacing={3}
              direction="column"
              sx={{
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <img src="https://i.gifer.com/ZKZg.gif" width={300} alt="" />
              <Typography variant="h4" component={"div"}>
                Loading...
              </Typography>
            </Stack>
          ) : (
            <>
              <Box
                // direction={{ md: "row" }}

                sx={{
                  display: "flex",
                  width: { md: "80%" },
                  // backgroundColor: "#16171d",
                  padding: { md: "2rem", sm: "1rem", xs: "1rem" },
                  flexWrap: "wrap",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: { sm: "center", xs: "center", md: "normal" },
                  gap: 4,
                  height: { md: "90vh", sm: "95%", xs: "95%" },
                  overflow: "hidden",
                  margin: { md: "0rem", sm: "1rem" },
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
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default App;
