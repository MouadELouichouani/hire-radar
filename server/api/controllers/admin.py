from flask import Blueprint, jsonify, request
from sqlalchemy import func

from config.db import SessionLocal
from core.models import User, Job, Application, Skill, Category

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


# ============================================================
# 1. GET /admin/stats → Platform metrics
# ============================================================
def get_platform_stats():
    db = SessionLocal()

    total_users = db.query(func.count(User.id)).scalar()
    total_jobs = db.query(func.count(Job.id)).scalar()
    total_applications = db.query(func.count(Application.id)).scalar()

    db.close()

    return jsonify({
        "total_users": total_users,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
    }), 200


# ============================================================
# 2. GET /admin/users → List all users
# ============================================================
def get_all_users():
    db = SessionLocal()

    users = (
        db.query(User)
        .filter(User.role != "admin")
        .all()
    )

    data = [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "role": u.role,
            "location": u.location,
            "image": u.image,
            "phone": u.phone,
            "headLine": u.headLine,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]

    db.close()
    return jsonify(data), 200



# ============================================================
# 3. DELETE /admin/users/<id> → Remove user
# ============================================================
def delete_user(user_id):
    db = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        db.close()
        return jsonify({"error": "User not found"}), 404

    db.delete(user)
    db.commit()
    db.close()

    return jsonify({"message": f"User {user_id} deleted successfully"}), 200


# ============================================================
# 4. GET /admin/jobs → List all jobs
# ============================================================
def get_all_jobs():
    db = SessionLocal()
    jobs = db.query(Job).all()

    data = [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "emp_type": j.emp_type,
            "salary_range": j.salary_range,
            "employer_id": j.employer_id,
            "category_id": j.category_id,
            "created_at": j.created_at.isoformat() if j.created_at else None,
        }
        for j in jobs
    ]

    db.close()
    return jsonify(data), 200


# ============================================================
# 5. DELETE /admin/jobs/<id> → Delete job
# ============================================================
def delete_job(job_id):
    db = SessionLocal()

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        db.close()
        return jsonify({"error": "Job not found"}), 404

    db.delete(job)
    db.commit()
    db.close()

    return jsonify({"message": f"Job {job_id} deleted successfully"}), 200


# ============================================================
# 6. GET /admin/skills → List all skills
# ============================================================
def get_all_skills():
    db = SessionLocal()
    skills = db.query(Skill).all()

    data = [{"id": s.id, "name": s.name} for s in skills]

    db.close()
    return jsonify(data), 200


# ============================================================
# 7. DELETE /admin/skills/<id> → Delete skill
# ============================================================
def delete_skill(skill_id):
    db = SessionLocal()

    skill = db.query(Skill).filter(Skill.id == skill_id).first()

    if not skill:
        db.close()
        return jsonify({"error": "Skill not found"}), 404

    db.delete(skill)
    db.commit()
    db.close()

    return jsonify({"message": f"Skill {skill_id} deleted successfully"}), 200


# ============================================================
# 8. PUT /admin/skills/<id> → Update skill
# ============================================================
def update_skill(skill_id):
    db = SessionLocal()

    skill = db.query(Skill).filter(Skill.id == skill_id).first()

    if not skill:
        db.close()
        return jsonify({"error": "Skill not found"}), 404

    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        db.close()
        return jsonify({"error": "Missing field: name"}), 400

    skill.name = new_name
    db.commit()
    db.close()

    return jsonify({"message": "Skill updated successfully"}), 200


# ============================================================
# 9. GET /admin/categories → List all categories
# ============================================================
def get_all_categories():
    db = SessionLocal()
    categories = db.query(Category).all()

    data = [{"id": c.id, "name": c.name} for c in categories]

    db.close()
    return jsonify(data), 200


# ============================================================
# 10. DELETE /admin/categories/<id>
# ============================================================
def delete_category(category_id):
    db = SessionLocal()

    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        db.close()
        return jsonify({"error": "Category not found"}), 404

    db.delete(category)
    db.commit()
    db.close()

    return jsonify({"message": f"Category {category_id} deleted successfully"}), 200


# ============================================================
# 11. PUT /admin/categories/<id> → Update category name
# ============================================================
def update_category(category_id):
    db = SessionLocal()

    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        db.close()
        return jsonify({"error": "Category not found"}), 404

    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        db.close()
        return jsonify({"error": "Missing field: name"}), 400

    category.name = new_name
    db.commit()
    db.close()

    return jsonify({"message": "Category updated successfully"}), 200
