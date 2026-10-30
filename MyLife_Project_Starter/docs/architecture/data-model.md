# 初步数据模型

以下为概念模型，正式建表前需要结合 API 和权限规则评审。

## User
- id
- display_name
- status
- created_at
- updated_at

## UserCredential
- id
- user_id
- question
- answer_hash
- updated_at
说明：答案哈希与用户身份绑定；不要保存明文答案。

## ClothingItem
- id
- user_id
- name
- category
- colors
- style_tags
- season
- brand
- source_url
- original_image_key
- processed_image_key
- processing_status
- created_at
- updated_at

## Avatar
- id
- user_id
- name
- source_image_key
- generated_image_key
- attributes_json
- status
- created_at
- updated_at

## Outfit
- id
- user_id
- avatar_id
- title
- garment_item_ids
- result_image_key
- generation_status
- provider
- provider_task_id
- created_at
- updated_at

## 关键数据约束
- 所有用户业务表必须有 user_id 或可追溯的用户归属。
- 所有读写按当前会话 user_id 过滤。
- 关联的 avatar、clothing item 和 outfit 必须属于同一用户。
- 删除策略需明确：软删除、级联删除和对象存储清理不能遗漏。
- 对外 API 不接受客户端指定目标 user_id 作为授权依据。
