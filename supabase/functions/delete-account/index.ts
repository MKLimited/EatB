import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ============================================================
//  XÓA TÀI KHOẢN: xóa dữ liệu của chính người đang đăng nhập rồi xóa tài khoản trong Supabase Auth.
//  Phải chạy bằng Edge Function vì xóa người dùng cần khóa quản trị (service role),
//  khóa này tuyệt đối không được đưa vào app.
// ============================================================
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: CORS_HEADERS })

// [tên bảng, cột chứa id người dùng]. Các khóa ngoại đã ON DELETE CASCADE nên đây là lớp bảo đảm thứ hai;
// lỗi ở một bảng (ví dụ bảng chưa tạo) không làm dừng toàn bộ quá trình.
const USER_TABLES: [string, string][] = [
  ['post_likes', 'user_id'],
  ['posts', 'user_id'],
  ['grocery_items', 'user_id'],
  ['health_scores', 'user_id'],
  ['water_logs', 'user_id'],
  ['user_settings', 'user_id'],
  ['chat_messages', 'user_id'],
  ['meal_plans', 'user_id'],
  ['user_food_logs', 'user_id'],
  ['user_workout_logs', 'user_id'],
  ['profiles', 'id'],
  ['users', 'id'],
]

// "xóa", "XÓA", "Xoa" -> "XOA"
const normalizeConfirm = (text: unknown) =>
  String(text ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .trim().toUpperCase()

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    const url = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !anonKey || !serviceKey) return json({ error: 'Máy chủ chưa được cấu hình đầy đủ' }, 500)

    // Xác định người dùng từ token đăng nhập, KHÔNG bao giờ tin id do app gửi lên
    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (!user || authError) return json({ error: 'Unauthorized' }, 401)

    const body = await req.json().catch(() => ({}))
    if (normalizeConfirm(body?.confirm) !== 'XOA') {
      return json({ error: 'Cần nhập đúng từ xác nhận "XÓA".' }, 400)
    }

    const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

    // 1. Xóa ảnh đại diện trong Storage (không nằm trong ràng buộc khóa ngoại nên phải xóa riêng)
    try {
      const { data: files } = await admin.storage.from('avatars').list(user.id, { limit: 1000 })
      if (files && files.length > 0) {
        await admin.storage.from('avatars').remove(files.map((f: { name: string }) => `${user.id}/${f.name}`))
      }
    } catch (err) {
      console.error('Lỗi xóa ảnh đại diện:', (err as Error).message)
    }

    // 2. Xóa dữ liệu của người dùng
    for (const [table, column] of USER_TABLES) {
      const { error } = await admin.from(table).delete().eq(column, user.id)
      if (error) console.error(`Lỗi xóa bảng ${table}:`, error.message)
    }

    // 3. Xóa tài khoản đăng nhập
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
    if (deleteError) {
      console.error('Lỗi xóa tài khoản Auth:', deleteError.message)
      return json({ error: 'Không thể xóa tài khoản lúc này. Vui lòng thử lại sau.' }, 500)
    }

    return json({ ok: true })
  } catch (err) {
    console.error('LỖI delete-account:', (err as Error)?.message ?? err)
    return json({ error: 'Đã xảy ra lỗi hệ thống.' }, 500)
  }
})