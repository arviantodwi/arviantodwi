export = UIData;
export as namespace UIData;

declare namespace UIData {
  interface CustomUIData {
    [key: string]: any;
  }

  interface AuthorUIData extends CustomUIData {
    name: string;
    city: string;
    country: string;
  }

  interface PortfolioUIData {
    title: string;
    description: string;
    images: string[];
  }
}
