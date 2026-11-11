
const baseUrl =
    "https://drfrontend-fubzbcbcgecbh5b3.germanywestcentral-01.azurewebsites.net/api/MusicRecord";

const authUrl =
    "https://drfrontend-fubzbcbcgecbh5b3.germanywestcentral-01.azurewebsites.net/api/Auth/login";

// Store JWT in memory while the app is running.
let jwtToken = null;

// Axios instance for protected API requests.
const api = axios.create();

// Automatically attach JWT to MusicRecord requests.
api.interceptors.request.use(config => {
    if (jwtToken) {
        config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    return config;
});

const app = Vue.createApp({
    data() {
        return {
            // LOGIN
            auth: {
                username: "",
                password: ""
            },

            loggedIn: false,
            jwtToken: null,
            role: null,
            authMessage: "",

            // RECORDS
            records: [],
            allRecords: [],
            singleRecord: null,

            // SEARCH
            title: "",
            titleToGetBy: "",
            idToGetBy: "",

            // DELETE
            deleteId: "",
            deleteMessage: "",

            // ADD
            addData: {
                title: "",
                artist: "",
                publicationYear: "",
                duration: ""
            },

            addMessage: "",

            // UPDATE
            updateData: {
                id: "",
                title: "",
                artist: "",
                publicationYear: "",
                duration: ""
            },

            updateMessage: ""
        };
    },

    methods: {

        // LOGIN
        async login() {
            this.authMessage = "";

            try {
                const response = await axios.post(authUrl, {
                    Username: this.auth.username,
                    Password: this.auth.password
                });

                // Get JWT from backend.
                this.jwtToken = response.data.token;
                jwtToken = this.jwtToken;

                if (!this.jwtToken) {
                    throw new Error("No JWT token received from the server.");
                }

                // Decode JWT payload to read the user's role.
                const base64Payload = this.jwtToken
                    .split(".")[1]
                    .replace(/-/g, "+")
                    .replace(/_/g, "/");

                const paddedPayload =
                    base64Payload.padEnd(
                        Math.ceil(base64Payload.length / 4) * 4,
                        "="
                    );

                const payload = JSON.parse(atob(paddedPayload));

                this.role =
                    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                    payload.role ||
                    null;

                this.loggedIn = true;
                this.authMessage = "Login successful!";

                // Load records after successful login.
                await this.getAllRecords();

            } catch (error) {
                this.jwtToken = null;
                jwtToken = null;
                this.role = null;
                this.loggedIn = false;

                this.authMessage =
                    error.response?.data ||
                    error.message ||
                    "Login failed. Check your username and password.";
            }
        },

        // LOGOUT
        logout() {
            this.jwtToken = null;
            jwtToken = null;

            this.role = null;
            this.loggedIn = false;

            this.auth = {
                username: "",
                password: ""
            };

            this.records = [];
            this.allRecords = [];
            this.singleRecord = null;

            this.authMessage = "You have logged out.";
        },

        // GET ALL RECORDS
        async getAllRecords() {
            await this.getAll(baseUrl);
        },

        async getAll(url) {
            try {
                const response = await api.get(url);

                this.allRecords = response.data;
                this.records = response.data;

            } catch (error) {
                console.error("Error getting records:", error);
                this.addMessage = this.getErrorMessage(error);
            }
        },

        // GET RECORDS BY TITLE
        async getByTitle(title) {
            if (!title || !title.trim()) {
                await this.getAllRecords();
                return;
            }

            const url =
                `${baseUrl}?titleContains=${encodeURIComponent(title.trim())}`;

            await this.getRecords(url);
        },

        async getRecords(url) {
            try {
                const response = await api.get(url);
                this.records = response.data;

            } catch (error) {
                console.error("Error searching records:", error);
                this.addMessage = this.getErrorMessage(error);
            }
        },

        // GET ONE RECORD BY ID
        async getById(id) {
            if (!id) {
                this.singleRecord = null;
                return;
            }

            try {
                const response = await api.get(`${baseUrl}/${id}`);
                this.singleRecord = response.data;

            } catch (error) {
                console.error("Error getting record:", error);
                this.singleRecord = null;
            }
        },

        // ADD RECORD
        async addRecord() {
            const record = {
                title: this.addData.title,
                artist: this.addData.artist,
                publicationYear: Number(this.addData.publicationYear),
                duration: Number(this.addData.duration)
            };

            if (
                !record.title?.trim() ||
                !record.artist?.trim() ||
                !record.publicationYear ||
                !record.duration
            ) {
                this.addMessage = "Please fill in all fields.";
                return;
            }

            try {
                await api.post(baseUrl, record);

                this.addMessage = "Record added successfully!";

                this.addData = {
                    title: "",
                    artist: "",
                    publicationYear: "",
                    duration: ""
                };

                await this.getAllRecords();

            } catch (error) {
                console.error("Error adding record:", error);
                this.addMessage = this.getErrorMessage(error);
            }
        },

        // DELETE RECORD
        async deleteRecord(id) {
            if (!id) {
                this.deleteMessage = "Please enter a record ID.";
                return;
            }

            try {
                await api.delete(`${baseUrl}/${id}`);

                this.deleteMessage = "Record deleted successfully!";
                this.deleteId = "";

                await this.getAllRecords();

            } catch (error) {
                console.error("Error deleting record:", error);
                this.deleteMessage = this.getErrorMessage(error);
            }
        },

        // UPDATE RECORD
        async updateRecord() {
            const id = this.updateData.id;

            if (!id) {
                this.updateMessage = "Please enter the ID of the record to update.";
                return;
            }

            const updatedRecord = {
                title: this.updateData.title,
                artist: this.updateData.artist,
                publicationYear: Number(this.updateData.publicationYear),
                duration: Number(this.updateData.duration)
            };

            if (
                !updatedRecord.title?.trim() ||
                !updatedRecord.artist?.trim() ||
                !updatedRecord.publicationYear ||
                !updatedRecord.duration
            ) {
                this.updateMessage = "Please fill in all update fields.";
                return;
            }

            try {
                await api.put(`${baseUrl}/${id}`, updatedRecord);

                this.updateMessage = "Record updated successfully!";

                this.updateData = {
                    id: "",
                    title: "",
                    artist: "",
                    publicationYear: "",
                    duration: ""
                };

                await this.getAllRecords();

            } catch (error) {
                console.error("Error updating record:", error);
                this.updateMessage = this.getErrorMessage(error);
            }
        },

        // FILTER RECORDS BY TITLE
        filterByTitle(title) {
            if (!title || !title.trim()) {
                this.records = [...this.allRecords];
                return;
            }

            const search = title.toLowerCase().trim();

            this.records = this.allRecords.filter(record =>
                record.title?.toLowerCase().includes(search)
            );
        },

        // SORT BY ID
        sortById() {
            this.records.sort((a, b) => a.id - b.id);
        },

        // SORT BY TITLE
        sortByTitle() {
            this.records.sort((a, b) =>
                (a.title || "").localeCompare(b.title || "")
            );
        },

        // SORT BY YEAR ASCENDING
        sortByYearAscending() {
            this.records.sort(
                (a, b) => a.publicationYear - b.publicationYear
            );
        },

        // SORT BY YEAR DESCENDING
        sortByYearDescending() {
            this.records.sort(
                (a, b) => b.publicationYear - a.publicationYear
            );
        },

        // ERROR MESSAGE HELPER
        getErrorMessage(error) {
            const data = error.response?.data;

            if (typeof data === "string") {
                return data;
            }

            return (
                data?.message ||
                data?.title ||
                error.message ||
                "Something went wrong."
            );
        }
    }
});

app.mount("#app");
