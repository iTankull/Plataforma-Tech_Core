const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const initialProductsState = `  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem('tech_products');
    if (storedProducts) {
      try {
        const parsed = JSON.parse(storedProducts);
        if (parsed.length > 0 && parsed[0].stock !== undefined) {
          return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_PRODUCTS;
  });`;

code = code.replace("  const [products, setProducts] = useState<Product[]>([]);", initialProductsState);

const initialReviewsState = `  const [reviews, setReviews] = useState<Review[]>(() => {
    const storedReviews = localStorage.getItem('tech_reviews');
    if (storedReviews) {
      try {
        return JSON.parse(storedReviews);
      } catch(e) {}
    }
    return DEFAULT_REVIEWS;
  });`;

code = code.replace("  const [reviews, setReviews] = useState<Review[]>([]);", initialReviewsState);

// Remove the useEffect that does this
const useEffectToRemove = `  // --- Load Initial Data ---
  useEffect(() => {
    // Products
    const storedProducts = localStorage.getItem('tech_products');
    let loadedProducts = null;
    try {
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (parsed.length > 0 && parsed[0].stock !== undefined) {
          loadedProducts = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    if (loadedProducts) {
      setProducts(loadedProducts);
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem('tech_products', JSON.stringify(DEFAULT_PRODUCTS));
    }

    // Reviews
    const storedReviews = localStorage.getItem('tech_reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(DEFAULT_REVIEWS);
      localStorage.setItem('tech_reviews', JSON.stringify(DEFAULT_REVIEWS));
    }

    // Current User
    const storedUser = localStorage.getItem('tech_current_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Sales Count
    const storedSales = localStorage.getItem('tech_sales_count');
    if (storedSales) {
      setSalesCount(parseInt(storedSales, 10));
    } else {
      localStorage.setItem('tech_sales_count', '24');
    }
  }, []);`;

code = code.replace(useEffectToRemove, `  // --- Load Initial Data ---
  useEffect(() => {
    // Current User
    const storedUser = localStorage.getItem('tech_current_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Sales Count
    const storedSales = localStorage.getItem('tech_sales_count');
    if (storedSales) {
      setSalesCount(parseInt(storedSales, 10));
    } else {
      localStorage.setItem('tech_sales_count', '24');
    }
    
    // Save defaults to storage if missing
    if (!localStorage.getItem('tech_products')) localStorage.setItem('tech_products', JSON.stringify(DEFAULT_PRODUCTS));
    if (!localStorage.getItem('tech_reviews')) localStorage.setItem('tech_reviews', JSON.stringify(DEFAULT_REVIEWS));
  }, []);`);

fs.writeFileSync('src/App.tsx', code);
