
export default class SupplierMaxServices {

  private static baseUrl = process.env.NEXT_PUBLIC_API_URL;

  static async getSuppliers() {
    const response = await fetch(`${this.baseUrl}/suppliers`);
    const data = await response.json();
    return data;
  }

  static async getSupplier(id: string) {
    const response = await fetch(`${this.baseUrl}/suppliers/${id}`);
    const data = await response.json();
    return data;
  }

  static async createSupplier(data: any) {
    const formData = new FormData();
    
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("image", data.image);

    const response = await fetch(`${this.baseUrl}/suppliers`, {
      method: "POST",
      body: formData,
    })
    return response;
  }

  static async updateSupplier(id: any, data: any) {
    const response = await fetch(`${this.baseUrl}/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    })
    return response;
  }

  static async deleteSupplier(id: string) {
    const response = await fetch(`${this.baseUrl}/suppliers/${id}`, {
      method: "DELETE",
    })
    return response;
  }
}