export const toAbsoluteUploadUrl = (req, value) => {
	if (!value) return value;
	if (typeof value !== "string") return value;
	if (value.startsWith("http://") || value.startsWith("https://")) return value;
	if (value.startsWith("/uploads/")) {
		const baseUrl = `${req.protocol}://${req.get("host")}`;
		return `${baseUrl}${value}`;
	}
	return value;
};

export const mapImagesToAbsolute = (req, images) => {
	if (!Array.isArray(images)) return images;
	return images.map((u) => toAbsoluteUploadUrl(req, u));
};


