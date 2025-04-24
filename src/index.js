import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
console.log(__dirname);

app.use(express.json());
app.set("views", path.join(__dirname, "/templates"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
	res.render("home");
});
// Initialize GoogleGenAI once
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

async function generateOptimizedAd(content, requirements, keywords) {
    const example = `🎉 Ơ Mây Zing Gút Chóp Pi! Phòng Xịn Sò Trần Duy Hưng Đã Xuất Hiện! 🎉

🔥 Team Cầu Giấy ơi, tin hot hòn họt đây! Ai đang "tuyển quân" tìm phòng đẹp - tiện nghi - giá yêu thương thì dừng ngay 5 giây để xem post này nha! 🔥

📍 Vị trí đắc địa khỏi bàn, ngõ ngách Trần Duy Hưng – Cầu Giấy (chấm để hóng địa chỉ cụ thể nha!)
🛏 Studio siêu rộng rãi, ban công chill hết nấc 🌿
✨ Nội thất "full topping": giường êm ái, tủ quần áo rộng rãi, điều hoà mát lạnh, nóng lạnh thả ga, tủ lạnh đựng cả thế giới, kệ bếp xinh xắn, bàn ghế làm việc/ăn uống tiện lợi, quạt trần mát rượi... (Máy giặt dùng chung, tha hồ giặt giũ nhé!)

🔑 Không chung chủ - Tự do như chim sẻ! Cổng vân tay an ninh tuyệt đối.
💯 Dịch vụ trọn gói "nhẹ nhàng như lông hồng" - Phí siêu hợp lý cho khu vực trung tâm, tiết kiệm kha khá đó!

💸 Thủ tục nhanh gọn lẹ: Cọc chỉ 1 tháng, hợp đồng linh hoạt.
🛵 Để xe thoải mái (nhưng giới hạn số lượng xíu nha, ưu tiên các bạn ở ghép!)

👉 Chần chừ gì nữa, inbox ngay để được "báo giá chi tiết" và rinh ngay em nó về dinh! Phòng đẹp là phải chớp cơ hội liền tay, kẻo lỡ mất lại tiếc hùi hụi đó nha! ❤️

📞 Zalo: 039.784.7805

#phongtrocaocap #tranduyhung #caugiay #phongxinh #noithatxinhso #giayeuthuong #khongchungchu #tudogiotac #canhotiennghi #dichvutrongoi #chillhethnac #nhanhchanconphong #omayzing #guutcho`;
	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: `Bạn là chuyên gia về lĩnh vực marketing, hãy viết 1 bài để thu hút khách hàng dựa vào nội dung sau :
                ${content}
                ${requirements}, mỗi dòng được để trong thẻ <p></p>
                Hãy sử dụng các từ khóa sau để tối ưu hóa nội dung cho SEO:
                ${keywords}, hãy viết bằng tiếng việt và không được phép sử dụng các từ ngữ nhạy cảm, không được phép sử dụng các từ ngữ không phù hợp với văn hóa người việt nam.
                Dưới đây là nội dung bài viết mẫu:
                ${example}`,
		});
		const optimizedContent = response.text;
		console.log("Optimized content generated successfully!");
		return optimizedContent;
	} catch (error) {
		console.error("Error generating or saving content:", error);
	} finally {
        // Optionally, you can close the AI client connection if needed
        // await ai.();
	}
}

app.post("/generate", async (req, res) => {
	const { content, requirements, keywords } = req.body;
	try {
		const result = await generateOptimizedAd(content, requirements, keywords);
		res.status(200).json({
			message: "Content generated successfully",
			result,
		});
	} catch (error) {
		console.error("Error generating content:", error);
		res.status(500).send("Error generating content");
	}
});
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
