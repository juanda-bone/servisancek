$(document).ready(() => {
  const form = $("form");
  const input = $("#nama");
  const tableBody = $("#table-body");
  const spinner = $(".spinner");
  const select = $(".berdasarkan")[0];

  tableBody.html(`<td colspan="10">tidak ada data</td>`);
  spinner.toggleClass("hide");

  // Ganti 'URL_API_ANDA' dengan URL API tujuan
  var apiUrl =
    "https://script.google.com/macros/s/AKfycby4R4CGgKoDtK7pSmZkaneoUBWyP-QPqVNfsg-1cFs1yq_KhVm3D3Pc5ehVXpz9MSh_zA/exec";
  var dataToSend = {
    sandi: "adminCelll", // Ganti dengan sandi yang sesuai
  };
  /*********************************************************************************
   *                                                                               *
   * fetch(apiUrl, {                                                               *
   *   method: "POST",                                                             *
   *   body: JSON.stringify(dataToSend),                                           *
   * })                                                                            *
   *   .then((response) => response.json())                                        *
   *   .then((data) => {                                                           *
   *     // Lakukan sesuatu dengan respon dari API (jika diperlukan)               *
   *     spinner.toggleClass("hide");                                              *
   *                                                                               *
   *     input.on("input", () => {                                                 *
   *       const berdasarkan = select.value;                                       *
   *       let filteredData;                                                       *
   *       if (berdasarkan == "0") {                                               *
   *         filteredData = data.filter(                                           *
   *           (item) => item[berdasarkan] == input.val()                          *
   *         );                                                                    *
   *       } else {                                                                *
   *         filteredData = data.filter((item) =>                                  *
   *           item[berdasarkan].toLowerCase().includes(input.val().toLowerCase()) *
   *         );                                                                    *
   *       }                                                                       *
   *       dataTable(filteredData);                                                *
   *       if (filteredData.length == 0) {                                         *
   *         tableBody.html(`<td colspan="10">tidak ada data</td>`);               *
   *       }                                                                       *
   *     });                                                                       *
   *                                                                               *
   *     dataTable(data.reverse());                                                *
   *   })                                                                          *
   *   .catch((error) => {                                                         *
   *     document.querySelector("body").html("<h1>Eror tidak di ketahui</h1>");    *
   *     console.error("Terjadi kesalahan:", error);                               *
   *     spinner.toggleClass("hide");                                              *
   *   });                                                                         *
   *                                                                               *
   *********************************************************************************/

  async function dataApi() {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      spinner.toggleClass("hide");

      dataTable(data.reverse());
      return data.reverse(); // Panggil fungsi reverse untuk mengembalikan data yang di-reverse
    } catch (error) {
      document.querySelector("body").innerHTML =
        "<h1>Error tidak diketahui</h1>";
      console.error("Terjadi kesalahan:", error);
      spinner.toggleClass("hide");
      return null; // Kembalikan null jika terjadi kesalahan
    }
  }

  // Memanggil fungsi dan menangani hasilnya
  dataApi().then((apiRes) => {
    if (apiRes !== null) {
      // Lakukan sesuatu dengan hasil dari API
      input.on("input", () => {
        const berdasarkan = select.value;
        let filteredData;
        if (berdasarkan == "0") {
          filteredData = apiRes.filter(
            (item) => item[berdasarkan] == input.val()
          );
        } else {
          filteredData = apiRes.filter((item) =>
            item[berdasarkan].toLowerCase().includes(input.val().toLowerCase())
          );
        }
        dataTable(filteredData.reverse());
        if (filteredData.length == 0) {
          tableBody.html(`<td colspan="10">tidak ada data</td>`);
        }
      });
    }
  });

  function formatDateToString(tanggal) {
    var date = new Date(tanggal); // Ganti dengan objek Date yang sesuai dengan tanggal yang ingin Anda kirim
    return date.toLocaleDateString("id-ID", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  }

  let networkDataReceived = false;
  let networkUpdate = fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(dataToSend),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      networkDataReceived = true;
      dataTable(data.reverse());
    });

  caches
    .match(apiUrl)
    .then(function (response) {
      if (!response) throw Error("no data on cache");
      return response.json();
    })
    .then(function (data) {
      if (!networkDataReceived) {
        dataTable(data.reverse());
        console.log("render data from cache");
      }
    })
    .catch(function () {
      return networkUpdate;
    });

  function dataTable(params) {
    let table = "";
    params.forEach((e) => {
      table += `
          <tr>
              <td>${e[0]}</td>
              <td>${formatDateToString(e[1])}</td>
              <td>${e[2]}</td>
              <td>${e[3]}</td>
              <td>${e[4]}</td>
              <td>${e[5]}</td>
              <td>${e[6]}</td>
              <td>${e[7]}</td>
              <td>${e[8]}</td>
              <td>${e[9]}</td>
          </tr>
          `;
    });
    tableBody.html(table);
    return;
  }
});
