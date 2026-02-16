def generate_ai_explanation(top_features, probability):
    reasons = []

    for feature, value in top_features:
        if value > 0:
            reasons.append(f"{feature} increased delay risk")
        else:
            reasons.append(f"{feature} reduced delay risk")

    explanation = f"Delay probability is {round(probability*100,1)}%. "
    explanation += "Key contributing factors: "
    explanation += ", ".join(reasons[:3]) + "."

    return explanation
