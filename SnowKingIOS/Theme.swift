import UIKit

enum Theme {
    static let page = UIColor(red: 1.00, green: 0.97, blue: 0.93, alpha: 1.0)
    static let card = UIColor.white
    static let ink = UIColor(red: 0.10, green: 0.13, blue: 0.18, alpha: 1.0)
    static let muted = UIColor(red: 0.40, green: 0.45, blue: 0.54, alpha: 1.0)
    static let line = UIColor(red: 0.18, green: 0.19, blue: 0.26, alpha: 1.0)
    static let accent = UIColor(red: 0.30, green: 0.59, blue: 1.00, alpha: 1.0)
    static let pink = UIColor(red: 1.00, green: 0.42, blue: 0.62, alpha: 1.0)
    static let mint = UIColor(red: 0.42, green: 0.80, blue: 0.47, alpha: 1.0)
    static let coral = UIColor(red: 1.00, green: 0.42, blue: 0.42, alpha: 1.0)
    static let orange = UIColor(red: 1.00, green: 0.55, blue: 0.26, alpha: 1.0)
    static let yellow = UIColor(red: 1.00, green: 0.85, blue: 0.24, alpha: 1.0)
    static let lavender = UIColor(red: 0.78, green: 0.49, blue: 1.00, alpha: 1.0)
    static let pinkSoft = UIColor(red: 1.00, green: 0.83, blue: 0.90, alpha: 1.0)
    static let mintSoft = UIColor(red: 0.78, green: 0.97, blue: 0.83, alpha: 1.0)
    static let skySoft = UIColor(red: 0.77, green: 0.88, blue: 1.00, alpha: 1.0)
    static let yellowSoft = UIColor(red: 1.00, green: 0.95, blue: 0.77, alpha: 1.0)
    static let lavenderSoft = UIColor(red: 0.93, green: 0.84, blue: 1.00, alpha: 1.0)
    static let orangeSoft = UIColor(red: 1.00, green: 0.88, blue: 0.80, alpha: 1.0)

    static func apply(to navigationBar: UINavigationBar) {
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = card
        appearance.titleTextAttributes = [.foregroundColor: ink]
        appearance.largeTitleTextAttributes = [.foregroundColor: ink]
        navigationBar.standardAppearance = appearance
        navigationBar.scrollEdgeAppearance = appearance
        navigationBar.compactAppearance = appearance
        navigationBar.prefersLargeTitles = false
    }

    static func button(_ title: String, color: UIColor = accent, textColor: UIColor = .white) -> UIButton {
        let button = UIButton(type: .system)
        button.setTitle(title, for: .normal)
        button.setTitleColor(textColor, for: .normal)
        button.titleLabel?.font = .systemFont(ofSize: 14, weight: .semibold)
        button.backgroundColor = color
        button.layer.cornerRadius = 10
        button.contentEdgeInsets = UIEdgeInsets(top: 9, left: 12, bottom: 9, right: 12)
        return button
    }

    static func iconButton(_ title: String, color: UIColor = accent) -> UIButton {
        let button = UIButton(type: .system)
        button.setTitle(title, for: .normal)
        button.setTitleColor(color, for: .normal)
        button.titleLabel?.font = .systemFont(ofSize: 20, weight: .semibold)
        button.backgroundColor = color.withAlphaComponent(0.12)
        button.layer.cornerRadius = 19
        return button
    }

    static func symbolButton(_ systemName: String, background: UIColor = card, tint: UIColor = ink) -> UIButton {
        let button = UIButton(type: .system)
        let image = UIImage(systemName: systemName)
        button.setImage(image, for: .normal)
        button.tintColor = tint
        button.backgroundColor = background
        button.layer.cornerRadius = 20
        button.layer.borderWidth = 2.5
        button.layer.borderColor = line.cgColor
        button.layer.shadowColor = line.cgColor
        button.layer.shadowOpacity = 1
        button.layer.shadowOffset = CGSize(width: 2, height: 2)
        button.layer.shadowRadius = 0
        return button
    }

    static func toolButton(title: String, systemName: String, background: UIColor) -> UIButton {
        let button = UIButton(type: .system)
        button.setImage(UIImage(systemName: systemName), for: .normal)
        button.setTitle(title, for: .normal)
        button.tintColor = ink
        button.setTitleColor(ink, for: .normal)
        button.titleLabel?.font = .systemFont(ofSize: 13, weight: .heavy)
        button.contentEdgeInsets = UIEdgeInsets(top: 8, left: 10, bottom: 8, right: 10)
        button.imageEdgeInsets = UIEdgeInsets(top: 0, left: -3, bottom: 0, right: 3)
        button.titleEdgeInsets = UIEdgeInsets(top: 0, left: 3, bottom: 0, right: -3)
        button.backgroundColor = background
        button.layer.cornerRadius = 14
        button.layer.borderWidth = 2.5
        button.layer.borderColor = line.cgColor
        button.layer.shadowColor = line.cgColor
        button.layer.shadowOpacity = 1
        button.layer.shadowOffset = CGSize(width: 2, height: 2)
        button.layer.shadowRadius = 0
        return button
    }

    static func borderedCard(_ view: UIView, radius: CGFloat = 18) {
        view.backgroundColor = card
        view.layer.cornerRadius = radius
        view.layer.borderWidth = 2.5
        view.layer.borderColor = line.cgColor
        view.layer.shadowColor = line.cgColor
        view.layer.shadowOpacity = 1
        view.layer.shadowOffset = CGSize(width: 3, height: 3)
        view.layer.shadowRadius = 0
    }

    static func label(_ text: String, size: CGFloat, weight: UIFont.Weight = .regular, color: UIColor = ink) -> UILabel {
        let label = UILabel()
        label.text = text
        label.textColor = color
        label.font = .systemFont(ofSize: size, weight: weight)
        label.numberOfLines = 1
        return label
    }
}

extension UIView {
    func pinToEdges(of view: UIView, insets: UIEdgeInsets = .zero) {
        translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: insets.left),
            trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -insets.right),
            topAnchor.constraint(equalTo: view.topAnchor, constant: insets.top),
            bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -insets.bottom)
        ])
    }

    func pinToSafeArea(of view: UIView, insets: UIEdgeInsets = .zero) {
        translatesAutoresizingMaskIntoConstraints = false
        let guide = view.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            leadingAnchor.constraint(equalTo: guide.leadingAnchor, constant: insets.left),
            trailingAnchor.constraint(equalTo: guide.trailingAnchor, constant: -insets.right),
            topAnchor.constraint(equalTo: guide.topAnchor, constant: insets.top),
            bottomAnchor.constraint(equalTo: guide.bottomAnchor, constant: -insets.bottom)
        ])
    }
}
