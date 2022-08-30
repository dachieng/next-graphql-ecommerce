import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import Header from "../components/header";
import { useTheme } from "@mui/material/styles";
import { gql } from "@apollo/client";
import client from "./api/apollo-client";

const useStyles = makeStyles(() => ({
  cardGrid: {
    paddingBottom: useTheme().spacing(8),
    marginTop: useTheme().spacing(3),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0",
  },
  img: {
    maxWidth: "100%",
    height: "80vh",
  },
}));

const Home = ({ products, categories, data }) => {
  const classes = useStyles();
  console.log(data);
  return (
    <>
      <Header data={categories} />
      <main>
        <Container maxWidth="lg" className={classes.cardGrid}>
          <Grid container spacing={2}>
            {data.map((product) => (
              <Link key={product.id} href={`product/${product.slug}`}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.img}
                      image={product.productImage[0].image}
                      component="img"
                      src={product.productImage[0].image}
                    />
                    <CardContent>
                      <Typography gutterBottom component="p">
                        {product.title}
                      </Typography>
                      <Box component="p" fontSize={16} fontWeight={900}>
                        ${product.regularPrice}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Link>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const response = await fetch("http://localhost:8000");
  const products = await response.json();

  const res = await fetch("http://localhost:8000/categories");
  const categories = await res.json();

  const { data } = await client.query({
    query: gql`
      query all_products {
        allProducts {
          id
          title
          description
          regularPrice
          slug
          productImage {
            image
          }
        }
      }

      query all_categories {
        allCategories {
          id
          name
        }
      }
    `,
  });
  console.log(data);

  return {
    props: {
      data: data.allProducts,
      products: products,
      //categories,
      categories: data.allCategories,
    },
  };
};
